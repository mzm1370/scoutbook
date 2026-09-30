import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  RFC_DOCUMENT_STATUSES,
  type FeatureRfcDocument,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@scoutbook/ui/components/select';
import { Textarea } from '@scoutbook/ui/components/textarea';
import { notifySuccess, rfcDocumentApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { RFC_DOCUMENT_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    status: z.enum(['DRAFT', 'ACCEPTED', 'REJECTED']),
    summary: z.string().trim().max(500),
    motivation: z.string().trim().max(500),
    detailedDesign: z.string().trim().max(500),
    alternatives: z.string().trim().max(500),
    drawbacks: z.string().trim().max(500),
  })
  .superRefine((values, ctx) => {
    if (values.status === 'ACCEPTED') {
      for (const key of ['summary', 'motivation', 'detailedDesign'] as const) {
        if (values[key].length < 5) {
          ctx.addIssue({
            code: 'custom',
            path: [key],
            message: 'Min 5 characters when Accepted',
          });
        }
      }
    }
    if (values.status === 'REJECTED' && values.summary.length < 5) {
      ctx.addIssue({
        code: 'custom',
        path: ['summary'],
        message: 'Short summary required when Rejected (min 5)',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const emptyValues: FormValues = {
  status: 'DRAFT',
  summary: '',
  motivation: '',
  detailedDesign: '',
  alternatives: '',
  drawbacks: '',
};

type Props = {
  featureId: number;
  token: string;
  canDecide: boolean;
};

export function FeatureRfcDocumentPanel({
  featureId,
  token,
  canDecide,
}: Props) {
  const [existing, setExisting] = useState<FeatureRfcDocument | null>(null);
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
        const row = await rfcDocumentApi.get(token, featureId);
        if (!ctl.cancelled) {
          setExisting(row);
          reset({
            status: row.status,
            summary: row.summary,
            motivation: row.motivation,
            detailedDesign: row.detailedDesign,
            alternatives: row.alternatives,
            drawbacks: row.drawbacks,
          });
        }
      } catch {
        if (!ctl.cancelled) {
          setExisting(null);
          reset(emptyValues);
        }
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [featureId, token, reset]);

  async function onSubmit(values: FormValues) {
    try {
      const saved = await rfcDocumentApi.upsert(token, featureId, values);
      setExisting(saved);
      reset({
        status: saved.status,
        summary: saved.summary,
        motivation: saved.motivation,
        detailedDesign: saved.detailedDesign,
        alternatives: saved.alternatives,
        drawbacks: saved.drawbacks,
      });
      notifySuccess('RFC document saved');
    } catch {
      // toast via interceptor
    }
  }

  const statusOptions = canDecide
    ? RFC_DOCUMENT_STATUSES
    : (['DRAFT'] as const);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">RFC document</CardTitle>
          {existing ? (
            <Badge variant="outline">
              {RFC_DOCUMENT_STATUS_LABELS[existing.status]}
            </Badge>
          ) : null}
        </div>
        <CardDescription>
          Structured design when an RFC is needed. Accepted body required if
          RFC check is Accepted before leaving RFC.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <form
            className="grid gap-4"
            onSubmit={handleSubmit((v) => void onSubmit(v))}
            noValidate
          >
            <FieldGroup>
              <Field data-invalid={Boolean(errors.status)}>
                <FieldLabel>Status</FieldLabel>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={!canDecide && field.value !== 'DRAFT'}
                    >
                      <SelectTrigger className="min-h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {RFC_DOCUMENT_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldDescription>
                  {canDecide
                    ? 'PO/PM can Accept or Reject'
                    : 'Developers save Draft; PO/PM decide'}
                </FieldDescription>
                <FieldError errors={[errors.status]} />
              </Field>

              {(
                [
                  ['summary', 'Summary'],
                  ['motivation', 'Motivation'],
                  ['detailedDesign', 'Detailed design'],
                  ['alternatives', 'Alternatives'],
                  ['drawbacks', 'Drawbacks'],
                ] as const
              ).map(([name, label]) => (
                <Field key={name} data-invalid={Boolean(errors[name])}>
                  <FieldLabel htmlFor={`rfc-doc-${name}`}>{label}</FieldLabel>
                  <Textarea
                    id={`rfc-doc-${name}`}
                    className="min-h-20"
                    maxLength={500}
                    placeholder="One short paragraph"
                    {...register(name)}
                  />
                  <FieldError errors={[errors[name]]} />
                </Field>
              ))}
            </FieldGroup>

            <Button
              type="submit"
              className="min-h-11 w-full sm:w-auto"
              disabled={isSubmitting || (!canDecide && status !== 'DRAFT')}
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : null}
              Save RFC document
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
