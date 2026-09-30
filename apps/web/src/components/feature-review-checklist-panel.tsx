import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  REVIEW_CHECKLIST_STATUSES,
  type FeatureReviewChecklist,
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
import { notifySuccess, reviewChecklistApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { REVIEW_CHECKLIST_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'APPROVED']),
    acceptanceCriteriaMet: z.boolean(),
    noOpenDecisionRequired: z.boolean(),
    rfcResolved: z.boolean(),
    testingEvidenceReviewed: z.boolean(),
    docsUpdatedIfNeeded: z.boolean(),
    summary: z.string().trim().max(500),
    notes: z.string().trim().max(500),
  })
  .superRefine((values, ctx) => {
    if (values.status !== 'APPROVED') return;
    if (
      !values.acceptanceCriteriaMet ||
      !values.noOpenDecisionRequired ||
      !values.rfcResolved ||
      !values.testingEvidenceReviewed ||
      !values.docsUpdatedIfNeeded
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['acceptanceCriteriaMet'],
        message: 'All five DoD items required for Approved',
      });
    }
    if (values.summary.length < 5) {
      ctx.addIssue({
        code: 'custom',
        path: ['summary'],
        message: 'Short summary required when Approved (min 5)',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  status: 'NOT_STARTED',
  acceptanceCriteriaMet: false,
  noOpenDecisionRequired: false,
  rfcResolved: false,
  testingEvidenceReviewed: false,
  docsUpdatedIfNeeded: false,
  summary: '',
  notes: '',
};

type Props = {
  featureId: number;
  token: string;
};

export function FeatureReviewChecklistPanel({ featureId, token }: Props) {
  const [existing, setExisting] = useState<FeatureReviewChecklist | null>(
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
        const row = await reviewChecklistApi.get(token, featureId);
        if (ctl.cancelled) return;
        setExisting(row);
        reset({
          status: row.status,
          acceptanceCriteriaMet: row.acceptanceCriteriaMet,
          noOpenDecisionRequired: row.noOpenDecisionRequired,
          rfcResolved: row.rfcResolved,
          testingEvidenceReviewed: row.testingEvidenceReviewed,
          docsUpdatedIfNeeded: row.docsUpdatedIfNeeded,
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
      const row = await reviewChecklistApi.upsert(token, featureId, values);
      setExisting(row);
      reset({
        status: row.status,
        acceptanceCriteriaMet: row.acceptanceCriteriaMet,
        noOpenDecisionRequired: row.noOpenDecisionRequired,
        rfcResolved: row.rfcResolved,
        testingEvidenceReviewed: row.testingEvidenceReviewed,
        docsUpdatedIfNeeded: row.docsUpdatedIfNeeded,
        summary: row.summary,
        notes: row.notes,
      });
      notifySuccess('Review checklist saved');
    } catch {
      // toast
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Review</CardTitle>
          {existing ? (
            <Badge variant="outline">
              {REVIEW_CHECKLIST_STATUS_LABELS[existing.status]}
            </Badge>
          ) : (
            <Badge variant="secondary">No checklist yet</Badge>
          )}
        </div>
        <CardDescription>
          Definition of Done. Leaving Review needs Approved plus all five
          checks and a short summary.
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
                        {REVIEW_CHECKLIST_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {REVIEW_CHECKLIST_STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.status?.message}</FieldError>
              </Field>

              <fieldset className="grid gap-2">
                <legend className="text-sm font-medium">
                  Definition of Done
                </legend>
                {(
                  [
                    [
                      'acceptanceCriteriaMet',
                      'Intake acceptance criteria met',
                    ],
                    [
                      'noOpenDecisionRequired',
                      'No Decision Required for shipped behavior',
                    ],
                    [
                      'rfcResolved',
                      'RFC Accepted or Not needed (as recorded)',
                    ],
                    [
                      'testingEvidenceReviewed',
                      'Testing evidence reviewed (checklist Passed)',
                    ],
                    [
                      'docsUpdatedIfNeeded',
                      'Docs updated if others rely on this',
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
                <FieldError>
                  {errors.acceptanceCriteriaMet?.message}
                </FieldError>
              </fieldset>

              <Field data-invalid={!!errors.summary}>
                <FieldLabel>Summary</FieldLabel>
                <Textarea
                  className="min-h-20"
                  maxLength={500}
                  placeholder="One short sentence — DoD outcome"
                  {...register('summary')}
                />
                <FieldDescription>
                  Required when status is Approved.
                </FieldDescription>
                <FieldError>{errors.summary?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.notes}>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Input
                  className="min-h-11"
                  maxLength={500}
                  placeholder="Follow-ups, caveats"
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
                'Save review checklist'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
