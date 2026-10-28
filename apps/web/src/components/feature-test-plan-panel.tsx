import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  TEST_PLAN_STATUSES,
  type FeatureProcessTrack,
  type FeatureTestPlan,
  type TestPlanStatus,
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
import { notifySuccess, testPlanApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { TEST_PLAN_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'READY', 'NOT_NEEDED']),
    unitPlanned: z.boolean(),
    integrationPlanned: z.boolean(),
    e2ePlanned: z.boolean(),
    summary: z.string().trim().max(500),
    notes: z.string().trim().max(500),
  })
  .superRefine((values, ctx) => {
    const anyTrue =
      values.unitPlanned || values.integrationPlanned || values.e2ePlanned;
    if (values.status === 'NOT_NEEDED' && anyTrue) {
      ctx.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'Not needed requires all three layer checkboxes off',
      });
    }
    if (values.status === 'READY' && !anyTrue) {
      ctx.addIssue({
        code: 'custom',
        path: ['unitPlanned'],
        message: 'Ready requires at least one of unit, integration, or e2e',
      });
    }
    if (values.status === 'READY' && values.summary.length < 5) {
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
  unitPlanned: false,
  integrationPlanned: false,
  e2ePlanned: false,
  summary: '',
  notes: '',
};

type Props = {
  featureId: number;
  token: string;
  processTrack: FeatureProcessTrack;
};

export function FeatureTestPlanPanel({
  featureId,
  token,
  processTrack,
}: Props) {
  const [existing, setExisting] = useState<FeatureTestPlan | null>(null);
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
        const row = await testPlanApi.get(token, featureId);
        if (ctl.cancelled) return;
        setExisting(row);
        reset({
          status: row.status,
          unitPlanned: row.unitPlanned,
          integrationPlanned: row.integrationPlanned,
          e2ePlanned: row.e2ePlanned,
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
    try {
      const saved = await testPlanApi.upsert(token, featureId, values);
      setExisting(saved);
      notifySuccess('Test plan saved', TEST_PLAN_STATUS_LABELS[saved.status]);
    } catch {
      // toast via interceptor
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Test plan</CardTitle>
          {existing ? (
            <Badge variant="outline">
              {TEST_PLAN_STATUS_LABELS[existing.status]}
            </Badge>
          ) : (
            <Badge variant="secondary">Not saved</Badge>
          )}
        </div>
        <CardDescription>
          {processTrack === 'LIGHT'
            ? 'Light track: set Not needed or Ready before leaving RACI.'
            : 'RFC track: set Ready (at least one layer) before leaving RACI.'}{' '}
          Plan before Implementation — evidence still lives in Testing.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading test plan…</p>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <fieldset className="grid gap-2 rounded-lg border p-3">
                <legend className="px-1 text-sm font-medium">
                  Layers planned
                </legend>
                {(
                  [
                    ['unitPlanned', 'Unit'],
                    ['integrationPlanned', 'Integration / API'],
                    ['e2ePlanned', 'E2E / journey'],
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
                <FieldError errors={[errors.unitPlanned]} />
              </fieldset>

              <Field data-invalid={!!errors.status}>
                <FieldLabel>Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) =>
                        field.onChange(v as TestPlanStatus)
                      }
                    >
                      <SelectTrigger className="min-h-11 w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {TEST_PLAN_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {TEST_PLAN_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {status === 'READY' ? (
                  <FieldDescription>
                    Check at least one layer and write a short summary.
                  </FieldDescription>
                ) : null}
                <FieldError errors={[errors.status]} />
              </Field>

              <Field data-invalid={!!errors.summary}>
                <FieldLabel htmlFor="test-plan-summary">Summary</FieldLabel>
                <Textarea
                  id="test-plan-summary"
                  rows={2}
                  maxLength={500}
                  placeholder="One short sentence — what each planned layer covers"
                  {...register('summary')}
                />
                <FieldError errors={[errors.summary]} />
              </Field>

              <Field data-invalid={!!errors.notes}>
                <FieldLabel htmlFor="test-plan-notes">Notes (optional)</FieldLabel>
                <Input
                  id="test-plan-notes"
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
                'Save test plan'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
