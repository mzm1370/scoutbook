import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  RFC_CHECK_STATUSES,
  type FeatureRfcCheck,
  type RfcCheckStatus,
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
import { notifySuccess, rfcCheckApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { RFC_CHECK_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    status: z.enum(['NOT_CHECKED', 'NOT_NEEDED', 'NEEDED', 'ACCEPTED']),
    changesSharedApi: z.boolean(),
    newArchitecture: z.boolean(),
    multiAppImpact: z.boolean(),
    summary: z.string().trim().max(500),
    docPath: z.string().trim().max(200),
  })
  .superRefine((values, ctx) => {
    const anyTrue =
      values.changesSharedApi ||
      values.newArchitecture ||
      values.multiAppImpact;
    if (values.status === 'NOT_NEEDED' && anyTrue) {
      ctx.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'Not needed requires all three checklist items off',
      });
    }
    if (
      (values.status === 'NEEDED' || values.status === 'ACCEPTED') &&
      !anyTrue
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['changesSharedApi'],
        message: 'Turn on at least one checklist item',
      });
    }
    if (
      (values.status === 'NEEDED' || values.status === 'ACCEPTED') &&
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
  status: 'NOT_CHECKED',
  changesSharedApi: false,
  newArchitecture: false,
  multiAppImpact: false,
  summary: '',
  docPath: '',
};

type Props = {
  featureId: number;
  token: string;
  canAccept: boolean;
};

export function FeatureRfcCheckPanel({
  featureId,
  token,
  canAccept,
}: Props) {
  const [existing, setExisting] = useState<FeatureRfcCheck | null>(null);
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
        const row = await rfcCheckApi.get(token, featureId);
        if (ctl.cancelled) return;
        setExisting(row);
        reset({
          status: row.status,
          changesSharedApi: row.changesSharedApi,
          newArchitecture: row.newArchitecture,
          multiAppImpact: row.multiAppImpact,
          summary: row.summary,
          docPath: row.docPath,
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
      const saved = await rfcCheckApi.upsert(token, featureId, values);
      setExisting(saved);
      notifySuccess('RFC check saved', RFC_CHECK_STATUS_LABELS[saved.status]);
    } catch {
      // toast via interceptor
    }
  }

  const statusOptions = RFC_CHECK_STATUSES.filter(
    (s) => canAccept || s !== 'ACCEPTED' || status === 'ACCEPTED',
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">RFC check</CardTitle>
          {existing ? (
            <Badge variant="outline">
              {RFC_CHECK_STATUS_LABELS[existing.status]}
            </Badge>
          ) : (
            <Badge variant="secondary">Not saved</Badge>
          )}
        </div>
        <CardDescription>
          Write an RFC only if shared API, new architecture, or multi-app
          impact. Full RFC text stays in docs/rfcs/ — this is the decision
          record. Leaving RFC requires Not needed or Accepted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading RFC check…</p>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <fieldset className="grid gap-2 rounded-lg border p-3">
                <legend className="px-1 text-sm font-medium">
                  Checklist (Stage 3)
                </legend>
                {(
                  [
                    ['changesSharedApi', 'Changes a shared package API/type'],
                    ['newArchitecture', 'New architecture / cross-cutting'],
                    ['multiAppImpact', 'Affects more than one app/service'],
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
                <FieldError errors={[errors.changesSharedApi]} />
              </fieldset>

              <Field data-invalid={!!errors.status}>
                <FieldLabel>Decision</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(v) =>
                        field.onChange(v as RfcCheckStatus)
                      }
                    >
                      <SelectTrigger className="min-h-11 w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {RFC_CHECK_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {!canAccept ? (
                  <FieldDescription>
                    Only PO/PM can set Accepted.
                  </FieldDescription>
                ) : null}
                <FieldError errors={[errors.status]} />
              </Field>

              <Field data-invalid={!!errors.summary}>
                <FieldLabel htmlFor="rfc-summary">Summary</FieldLabel>
                <Textarea
                  id="rfc-summary"
                  rows={2}
                  maxLength={500}
                  placeholder="One short sentence — why RFC is needed or why not"
                  {...register('summary')}
                />
                <FieldError errors={[errors.summary]} />
              </Field>

              <Field data-invalid={!!errors.docPath}>
                <FieldLabel htmlFor="rfc-doc">Doc path (optional)</FieldLabel>
                <Input
                  id="rfc-doc"
                  maxLength={200}
                  placeholder="docs/rfcs/0006-title.md"
                  {...register('docPath')}
                />
                <FieldError errors={[errors.docPath]} />
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
                'Save RFC check'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
