import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  UX_DESIGN_STATUSES,
  type FeatureProcessTrack,
  type FeatureUxDesign,
  type UxDesignStatus,
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
import { notifySuccess, uxDesignApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { UX_DESIGN_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'READY', 'NOT_NEEDED']),
    happyPathCovered: z.boolean(),
    emptyStateCovered: z.boolean(),
    loadingStateCovered: z.boolean(),
    errorStateCovered: z.boolean(),
    summary: z.string().trim().max(500),
    mockupPath: z.string().trim().max(200),
    notes: z.string().trim().max(500),
  })
  .superRefine((values, ctx) => {
    const anyTrue =
      values.happyPathCovered ||
      values.emptyStateCovered ||
      values.loadingStateCovered ||
      values.errorStateCovered;
    const allTrue =
      values.happyPathCovered &&
      values.emptyStateCovered &&
      values.loadingStateCovered &&
      values.errorStateCovered;
    if (values.status === 'NOT_NEEDED' && anyTrue) {
      ctx.addIssue({
        code: 'custom',
        path: ['status'],
        message: 'Not needed requires all four state checkboxes off',
      });
    }
    if (values.status === 'READY' && !allTrue) {
      ctx.addIssue({
        code: 'custom',
        path: ['happyPathCovered'],
        message: 'Ready requires happy, empty, loading, and error covered',
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
  happyPathCovered: false,
  emptyStateCovered: false,
  loadingStateCovered: false,
  errorStateCovered: false,
  summary: '',
  mockupPath: '',
  notes: '',
};

type Props = {
  featureId: number;
  token: string;
  processTrack: FeatureProcessTrack;
};

export function FeatureUxDesignPanel({
  featureId,
  token,
  processTrack,
}: Props) {
  const [existing, setExisting] = useState<FeatureUxDesign | null>(null);
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
        const row = await uxDesignApi.get(token, featureId);
        if (ctl.cancelled) return;
        setExisting(row);
        reset({
          status: row.status,
          happyPathCovered: row.happyPathCovered,
          emptyStateCovered: row.emptyStateCovered,
          loadingStateCovered: row.loadingStateCovered,
          errorStateCovered: row.errorStateCovered,
          summary: row.summary,
          mockupPath: row.mockupPath,
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
      const saved = await uxDesignApi.upsert(token, featureId, values);
      setExisting(saved);
      notifySuccess('UX design saved', UX_DESIGN_STATUS_LABELS[saved.status]);
    } catch {
      // toast via interceptor
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">UX design</CardTitle>
          {existing ? (
            <Badge variant="outline">
              {UX_DESIGN_STATUS_LABELS[existing.status]}
            </Badge>
          ) : (
            <Badge variant="secondary">Not saved</Badge>
          )}
        </div>
        <CardDescription>
          {processTrack === 'LIGHT'
            ? 'Light track: set Not needed or Ready before leaving RFC.'
            : 'RFC track: set Ready (all four UI states) before leaving RFC.'}{' '}
          Capture happy, empty, loading, and error — no new Kanban stage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading UX design…</p>
        ) : (
          <form
            className="grid gap-3"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <fieldset className="grid gap-2 rounded-lg border p-3">
                <legend className="px-1 text-sm font-medium">
                  UI states covered
                </legend>
                {(
                  [
                    ['happyPathCovered', 'Happy path'],
                    ['emptyStateCovered', 'Empty state'],
                    ['loadingStateCovered', 'Loading state'],
                    ['errorStateCovered', 'Error state'],
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
                <FieldError errors={[errors.happyPathCovered]} />
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
                        field.onChange(v as UxDesignStatus)
                      }
                    >
                      <SelectTrigger className="min-h-11 w-full">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {UX_DESIGN_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {UX_DESIGN_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {status === 'READY' ? (
                  <FieldDescription>
                    All four state checkboxes must be on.
                  </FieldDescription>
                ) : null}
                <FieldError errors={[errors.status]} />
              </Field>

              <Field data-invalid={!!errors.summary}>
                <FieldLabel htmlFor="ux-summary">Summary</FieldLabel>
                <Textarea
                  id="ux-summary"
                  rows={2}
                  maxLength={500}
                  placeholder="One short sentence — mockup note or why UX is not needed"
                  {...register('summary')}
                />
                <FieldError errors={[errors.summary]} />
              </Field>

              <Field data-invalid={!!errors.mockupPath}>
                <FieldLabel htmlFor="ux-mockup">Mockup path (optional)</FieldLabel>
                <Input
                  id="ux-mockup"
                  maxLength={200}
                  placeholder="docs/… or Figma URL"
                  {...register('mockupPath')}
                />
                <FieldError errors={[errors.mockupPath]} />
              </Field>

              <Field data-invalid={!!errors.notes}>
                <FieldLabel htmlFor="ux-notes">Notes (optional)</FieldLabel>
                <Input
                  id="ux-notes"
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
                'Save UX design'
              )}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
