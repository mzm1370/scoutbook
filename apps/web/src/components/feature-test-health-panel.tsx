import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  TEST_HEALTH_STATUSES,
  type FeatureTestHealth,
  type TestHealthStatus,
} from '@scoutbook/types';
import { z } from 'zod';
import { Badge } from '@scoutbook/ui/components/badge';
import { Button } from '@scoutbook/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@scoutbook/ui/components/field';
import { Input } from '@scoutbook/ui/components/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@scoutbook/ui/components/select';
import { Textarea } from '@scoutbook/ui/components/textarea';
import { notifySuccess, testHealthApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { TEST_HEALTH_STATUS_LABELS } from '@web/lib/labels';

function parseOptionalInt(
  raw: string,
  opts: { max?: number } = {},
): { ok: true; value: number | null } | { ok: false; message: string } {
  const trimmed = raw.trim();
  if (trimmed === '') return { ok: true, value: null };
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, message: 'Non-negative integer' };
  }
  const n = Number(trimmed);
  if (opts.max != null && n > opts.max) {
    return { ok: false, message: `0–${opts.max} integer` };
  }
  return { ok: true, value: n };
}

const schema = z
  .object({
    status: z.enum([
      'NOT_STARTED',
      'WATCHING',
      'HEALTHY',
      'AT_RISK',
      'NOT_NEEDED',
    ]),
    failureRateChecked: z.boolean(),
    flakyChecked: z.boolean(),
    durationChecked: z.boolean(),
    failureRatePct: z.string(),
    flakyCount: z.string(),
    durationMinutes: z.string(),
    summary: z.string().trim().max(500),
    notes: z.string().trim().max(500),
  })
  .superRefine((values, ctx) => {
    const anyCheck =
      values.failureRateChecked ||
      values.flakyChecked ||
      values.durationChecked;
    const allChecks =
      values.failureRateChecked &&
      values.flakyChecked &&
      values.durationChecked;

    const fail = parseOptionalInt(values.failureRatePct, { max: 100 });
    if (!fail.ok) {
      ctx.addIssue({
        code: 'custom',
        path: ['failureRatePct'],
        message: fail.message,
      });
    }
    const flaky = parseOptionalInt(values.flakyCount);
    if (!flaky.ok) {
      ctx.addIssue({
        code: 'custom',
        path: ['flakyCount'],
        message: flaky.message,
      });
    }
    const duration = parseOptionalInt(values.durationMinutes);
    if (!duration.ok) {
      ctx.addIssue({
        code: 'custom',
        path: ['durationMinutes'],
        message: duration.message,
      });
    }
    const anyMetric =
      (fail.ok && fail.value != null) ||
      (flaky.ok && flaky.value != null) ||
      (duration.ok && duration.value != null);

    if (values.status === 'NOT_NEEDED' && (anyCheck || anyMetric)) {
      ctx.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'Not needed requires checks off and no metrics',
      });
    }
    if (values.status === 'HEALTHY' && !allChecks) {
      ctx.addIssue({
        code: 'custom',
        path: ['failureRateChecked'],
        message: 'Healthy requires all three watches checked',
      });
    }
    if (
      (values.status === 'HEALTHY' || values.status === 'AT_RISK') &&
      values.summary.length < 5
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['summary'],
        message: 'Short summary required (min 5 characters)',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  status: 'NOT_STARTED',
  failureRateChecked: false,
  flakyChecked: false,
  durationChecked: false,
  failureRatePct: '',
  flakyCount: '',
  durationMinutes: '',
  summary: '',
  notes: '',
};

type Props = {
  featureId: number;
  token: string;
};

export function FeatureTestHealthPanel({ featureId, token }: Props) {
  const [existing, setExisting] = useState<FeatureTestHealth | null>(null);
  const [loading, setLoading] = useState(true);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
    mode: 'onTouched',
  });

  const status = useWatch({ control, name: 'status' });

  useEffect(() => {
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const row = await testHealthApi.get(token, featureId);
        if (ctl.cancelled) return;
        setExisting(row);
        reset({
          status: row.status,
          failureRateChecked: row.failureRateChecked,
          flakyChecked: row.flakyChecked,
          durationChecked: row.durationChecked,
          failureRatePct:
            row.failureRatePct == null ? '' : String(row.failureRatePct),
          flakyCount: row.flakyCount == null ? '' : String(row.flakyCount),
          durationMinutes:
            row.durationMinutes == null ? '' : String(row.durationMinutes),
          summary: row.summary,
          notes: row.notes,
        });
      } catch {
        if (ctl.cancelled) return;
        setExisting(null);
        reset(emptyValues);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [featureId, token, reset]);

  async function onSubmit(values: FormValues) {
    const fail = parseOptionalInt(values.failureRatePct, { max: 100 });
    const flaky = parseOptionalInt(values.flakyCount);
    const duration = parseOptionalInt(values.durationMinutes);
    if (!fail.ok || !flaky.ok || !duration.ok) return;
    try {
      const saved = await testHealthApi.upsert(token, featureId, {
        status: values.status,
        failureRateChecked: values.failureRateChecked,
        flakyChecked: values.flakyChecked,
        durationChecked: values.durationChecked,
        failureRatePct: fail.value,
        flakyCount: flaky.value,
        durationMinutes: duration.value,
        summary: values.summary,
        notes: values.notes,
      });
      setExisting(saved);
      notifySuccess('Test health saved', TEST_HEALTH_STATUS_LABELS[saved.status]);
    } catch {
      // toast via interceptor
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Test health</CardTitle>
          {existing ? (
            <Badge variant="outline">
              {TEST_HEALTH_STATUS_LABELS[existing.status]}
            </Badge>
          ) : (
            <Badge variant="secondary">Not saved</Badge>
          )}
        </div>
        <CardDescription>
          After ship: note CI failure rate, flakes, and suite duration. Manual
          watch for now — live dashboards later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading test health…</p>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <fieldset className="grid gap-2 rounded-lg border p-3">
                <legend className="px-1 text-sm font-medium">
                  Watched signals
                </legend>
                {(
                  [
                    ['failureRateChecked', 'CI failure rate reviewed'],
                    ['flakyChecked', 'Flaky tests reviewed'],
                    ['durationChecked', 'Suite duration reviewed'],
                  ] as const
                ).map(([name, label]) => (
                  <Controller
                    key={name}
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                        <input
                          type="checkbox"
                          className="size-4"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                        {label}
                      </label>
                    )}
                  />
                ))}
                <FieldError errors={[errors.failureRateChecked]} />
              </fieldset>

              <div className="grid gap-3 sm:grid-cols-3">
                <Field data-invalid={!!errors.failureRatePct}>
                  <FieldLabel htmlFor="th-fail">Failure % (opt)</FieldLabel>
                  <Input
                    id="th-fail"
                    type="number"
                    min={0}
                    max={100}
                    className="min-h-11"
                    placeholder="e.g. 2"
                    {...register('failureRatePct')}
                  />
                  <FieldError errors={[errors.failureRatePct]} />
                </Field>
                <Field data-invalid={!!errors.flakyCount}>
                  <FieldLabel htmlFor="th-flaky">Flaky count (opt)</FieldLabel>
                  <Input
                    id="th-flaky"
                    type="number"
                    min={0}
                    className="min-h-11"
                    placeholder="e.g. 1"
                    {...register('flakyCount')}
                  />
                  <FieldError errors={[errors.flakyCount]} />
                </Field>
                <Field data-invalid={!!errors.durationMinutes}>
                  <FieldLabel htmlFor="th-dur">Duration min (opt)</FieldLabel>
                  <Input
                    id="th-dur"
                    type="number"
                    min={0}
                    className="min-h-11"
                    placeholder="e.g. 12"
                    {...register('durationMinutes')}
                  />
                  <FieldError errors={[errors.durationMinutes]} />
                </Field>
              </div>

              <Field data-invalid={!!errors.status}>
                <FieldLabel>Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) =>
                        field.onChange(v as TestHealthStatus)
                      }
                    >
                      <SelectTrigger className="min-h-11 w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEST_HEALTH_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {TEST_HEALTH_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {status === 'HEALTHY' ? (
                  <FieldDescription>
                    All three watches must be checked.
                  </FieldDescription>
                ) : null}
                <FieldError errors={[errors.status]} />
              </Field>

              <Field data-invalid={!!errors.summary}>
                <FieldLabel htmlFor="th-summary">Summary</FieldLabel>
                <Textarea
                  id="th-summary"
                  rows={2}
                  maxLength={500}
                  placeholder="One short sentence — what you saw after ship"
                  {...register('summary')}
                />
                <FieldError errors={[errors.summary]} />
              </Field>

              <Field data-invalid={!!errors.notes}>
                <FieldLabel htmlFor="th-notes">Notes (optional)</FieldLabel>
                <Input
                  id="th-notes"
                  maxLength={500}
                  placeholder="Extra context"
                  {...register('notes')}
                />
                <FieldError errors={[errors.notes]} />
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              className="min-h-11 w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : (
                'Save test health'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
