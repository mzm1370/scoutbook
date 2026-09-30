import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  RELEASE_LOG_STATUSES,
  type FeatureReleaseLog,
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
import { notifySuccess, releaseLogApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { RELEASE_LOG_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    status: z.enum(['NOT_STARTED', 'SHIPPED', 'OBSERVING', 'STABLE']),
    summary: z.string().trim().max(500),
    watchStarted: z.boolean(),
    notes: z.string().trim().max(500),
  })
  .superRefine((values, ctx) => {
    if (values.status === 'NOT_STARTED') return;
    if (values.summary.length < 5) {
      ctx.addIssue({
        code: 'custom',
        path: ['summary'],
        message: 'Short summary required once shipped (min 5)',
      });
    }
    if (
      (values.status === 'OBSERVING' || values.status === 'STABLE') &&
      !values.watchStarted
    ) {
      ctx.addIssue({
        code: 'custom',
        path: ['watchStarted'],
        message: 'Mark watch started for Observing / Stable',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  status: 'NOT_STARTED',
  summary: '',
  watchStarted: false,
  notes: '',
};

type Props = {
  featureId: number;
  token: string;
};

export function FeatureReleaseLogPanel({ featureId, token }: Props) {
  const [existing, setExisting] = useState<FeatureReleaseLog | null>(null);
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
        const row = await releaseLogApi.get(token, featureId);
        if (ctl.cancelled) return;
        setExisting(row);
        reset({
          status: row.status,
          summary: row.summary,
          watchStarted: row.watchStarted,
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
    const saved = await releaseLogApi.upsert(token, featureId, values);
    setExisting(saved);
    reset({
      status: saved.status,
      summary: saved.summary,
      watchStarted: saved.watchStarted,
      notes: saved.notes,
    });
    notifySuccess(
      'Release log saved',
      RELEASE_LOG_STATUS_LABELS[saved.status],
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Release</CardTitle>
          {existing ? (
            <Badge variant="secondary">
              {RELEASE_LOG_STATUS_LABELS[existing.status]}
            </Badge>
          ) : null}
        </div>
        <CardDescription>
          Stage 8 — what shipped and whether you are watching it.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field data-invalid={!!errors.status}>
                <FieldLabel>Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="min-h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELEASE_LOG_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {RELEASE_LOG_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.status?.message}</FieldError>
              </Field>

              <Controller
                control={control}
                name="watchStarted"
                render={({ field }) => (
                  <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      className="size-4"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                    Post-release watch started
                  </label>
                )}
              />
              <FieldError>{errors.watchStarted?.message}</FieldError>

              <Field data-invalid={!!errors.summary}>
                <FieldLabel>Summary</FieldLabel>
                <Textarea
                  className="min-h-20"
                  maxLength={500}
                  placeholder="One short sentence — what shipped where"
                  {...register('summary')}
                />
                <FieldDescription>
                  Required once status is Shipped or later.
                </FieldDescription>
                <FieldError>{errors.summary?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.notes}>
                <FieldLabel>Notes (optional)</FieldLabel>
                <Input
                  className="min-h-11"
                  maxLength={500}
                  placeholder="Rollback plan, monitors, caveats"
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
                'Save release log'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
