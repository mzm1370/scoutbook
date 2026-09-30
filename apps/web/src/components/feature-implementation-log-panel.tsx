import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  IMPLEMENTATION_LOG_STATUSES,
  type FeatureImplementationLog,
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
import { implementationLogApi, notifySuccess } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { IMPLEMENTATION_LOG_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'READY_FOR_TEST']),
    summary: z.string().trim().max(500),
    branchOrPr: z.string().trim().max(300),
    notes: z.string().trim().max(500),
  })
  .superRefine((values, ctx) => {
    if (values.status === 'READY_FOR_TEST' && values.summary.length < 5) {
      ctx.addIssue({
        code: 'custom',
        path: ['summary'],
        message: 'Short summary required when Ready for test (min 5)',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  status: 'NOT_STARTED',
  summary: '',
  branchOrPr: '',
  notes: '',
};

type Props = {
  featureId: number;
  token: string;
};

export function FeatureImplementationLogPanel({ featureId, token }: Props) {
  const [existing, setExisting] = useState<FeatureImplementationLog | null>(
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
        const row = await implementationLogApi.get(token, featureId);
        if (ctl.cancelled) return;
        setExisting(row);
        reset({
          status: row.status,
          summary: row.summary,
          branchOrPr: row.branchOrPr,
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
      const row = await implementationLogApi.upsert(token, featureId, values);
      setExisting(row);
      reset({
        status: row.status,
        summary: row.summary,
        branchOrPr: row.branchOrPr,
        notes: row.notes,
      });
      notifySuccess('Implementation log saved');
    } catch {
      // toast via interceptor
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Implementation</CardTitle>
          {existing ? (
            <Badge variant="outline">
              {IMPLEMENTATION_LOG_STATUS_LABELS[existing.status]}
            </Badge>
          ) : (
            <Badge variant="secondary">No log yet</Badge>
          )}
        </div>
        <CardDescription>
          Short build notes. Leaving Implementation needs Ready for test plus
          a one-line summary.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading log…</p>
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
                        {IMPLEMENTATION_LOG_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {IMPLEMENTATION_LOG_STATUS_LABELS[status]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.status?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.summary}>
                <FieldLabel>What was built</FieldLabel>
                <Textarea
                  className="min-h-20"
                  maxLength={500}
                  placeholder="One short sentence — endpoints, UI, tests"
                  {...register('summary')}
                />
                <FieldDescription>
                  Required when status is Ready for test.
                </FieldDescription>
                <FieldError>{errors.summary?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.branchOrPr}>
                <FieldLabel>Branch / PR (optional)</FieldLabel>
                <Input
                  className="min-h-11"
                  maxLength={300}
                  placeholder="feat/… or PR URL"
                  {...register('branchOrPr')}
                />
                <FieldError>{errors.branchOrPr?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.notes}>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Input
                  className="min-h-11"
                  maxLength={500}
                  placeholder="Deferred items, risks"
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
                'Save implementation log'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
