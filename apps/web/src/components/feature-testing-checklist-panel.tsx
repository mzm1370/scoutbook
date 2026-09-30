import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  TESTING_CHECKLIST_STATUSES,
  type FeatureTestingChecklist,
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
import { notifySuccess, testingChecklistApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { TESTING_CHECKLIST_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'PASSED']),
    unitOrIntegrationPassed: z.boolean(),
    acceptanceValidated: z.boolean(),
    noOpenDecisionRequired: z.boolean(),
    summary: z.string().trim().max(500),
    notes: z.string().trim().max(500),
  })
  .superRefine((values, ctx) => {
    if (values.status !== 'PASSED') return;
    if (
      !values.unitOrIntegrationPassed ||
      !values.acceptanceValidated ||
      !values.noOpenDecisionRequired
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['unitOrIntegrationPassed'],
        message: 'All three proof items required for Passed',
      });
    }
    if (values.summary.length < 5) {
      ctx.addIssue({
        code: 'custom',
        path: ['summary'],
        message: 'Short summary required when Passed (min 5)',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  status: 'NOT_STARTED',
  unitOrIntegrationPassed: false,
  acceptanceValidated: false,
  noOpenDecisionRequired: false,
  summary: '',
  notes: '',
};

type Props = {
  featureId: number;
  token: string;
};

export function FeatureTestingChecklistPanel({ featureId, token }: Props) {
  const [existing, setExisting] = useState<FeatureTestingChecklist | null>(
    null,
  );
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

  useEffect(() => {
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const row = await testingChecklistApi.get(token, featureId);
        if (ctl.cancelled) return;
        setExisting(row);
        reset({
          status: row.status,
          unitOrIntegrationPassed: row.unitOrIntegrationPassed,
          acceptanceValidated: row.acceptanceValidated,
          noOpenDecisionRequired: row.noOpenDecisionRequired,
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
      const row = await testingChecklistApi.upsert(token, featureId, values);
      setExisting(row);
      reset({
        status: row.status,
        unitOrIntegrationPassed: row.unitOrIntegrationPassed,
        acceptanceValidated: row.acceptanceValidated,
        noOpenDecisionRequired: row.noOpenDecisionRequired,
        summary: row.summary,
        notes: row.notes,
      });
      notifySuccess('Testing checklist saved');
    } catch {
      // toast
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Testing</CardTitle>
          {existing ? (
            <Badge variant="outline">
              {TESTING_CHECKLIST_STATUS_LABELS[existing.status]}
            </Badge>
          ) : (
            <Badge variant="secondary">No checklist yet</Badge>
          )}
        </div>
        <CardDescription>
          Prove it works. Leaving Testing needs Passed plus all three checks
          and a short summary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading checklist…</p>
        ) : (
          <form
            className="grid gap-4"
            onSubmit={handleSubmit((v) => void onSubmit(v))}
          >
            <FieldGroup>
              <Field data-invalid={!!errors.status}>
                <FieldLabel>Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="min-h-11">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {TESTING_CHECKLIST_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {TESTING_CHECKLIST_STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.status?.message}</FieldError>
              </Field>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-medium">Proof</legend>
                {(
                  [
                    [
                      'unitOrIntegrationPassed',
                      'Unit / integration (or agreed) tests passed',
                    ],
                    [
                      'acceptanceValidated',
                      'QA validated against written acceptance criteria',
                    ],
                    [
                      'noOpenDecisionRequired',
                      'No Decision Required rows for shipped behavior',
                    ],
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
                <FieldError>{errors.unitOrIntegrationPassed?.message}</FieldError>
              </fieldset>

              <Field data-invalid={!!errors.summary}>
                <FieldLabel>Summary</FieldLabel>
                <Textarea
                  className="min-h-20"
                  maxLength={500}
                  placeholder="One short sentence — what was proven"
                  {...register('summary')}
                />
                <FieldDescription>
                  Required when status is Passed.
                </FieldDescription>
                <FieldError>{errors.summary?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.notes}>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Input
                  className="min-h-11"
                  maxLength={500}
                  placeholder="Scope of targeted run, known gaps"
                  {...register('notes')}
                />
                <FieldError>{errors.notes?.message}</FieldError>
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
                'Save testing checklist'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
