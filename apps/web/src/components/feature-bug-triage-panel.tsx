import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  BUG_TRIAGE_RISKS,
  BUG_TRIAGE_STATUSES,
  BUG_TRIAGE_TYPES,
  type FeatureBugTriage,
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
import { bugTriageApi, notifySuccess } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import {
  BUG_TRIAGE_RISK_LABELS,
  BUG_TRIAGE_STATUS_LABELS,
  BUG_TRIAGE_TYPE_LABELS,
} from '@web/lib/labels';

const schema = z.object({
  whatHappened: z.string().trim().min(2).max(300),
  expected: z.string().trim().min(1).max(300),
  reproduce: z.string().trim().max(500),
  bugType: z.enum(['REGRESSION', 'SCOUTING_GAP', 'UNSURE']),
  riskTier: z.enum(['P1', 'P2', 'P3', 'UNKNOWN']),
  status: z.enum(['OPEN', 'RESOLVED', 'ESCALATED_TO_PO']),
});

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  whatHappened: '',
  expected: '',
  reproduce: '',
  bugType: 'UNSURE',
  riskTier: 'UNKNOWN',
  status: 'OPEN',
};

type Props = {
  featureId: number;
  token: string;
};

export function FeatureBugTriagePanel({ featureId, token }: Props) {
  const [rows, setRows] = useState<FeatureBugTriage[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  useEffect(() => {
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const list = await bugTriageApi.list(token, featureId);
        if (!ctl.cancelled) setRows(list);
      } catch {
        if (!ctl.cancelled) setRows([]);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [featureId, token]);

  function startEdit(row: FeatureBugTriage) {
    setEditingId(row.id);
    reset({
      whatHappened: row.whatHappened,
      expected: row.expected,
      reproduce: row.reproduce,
      bugType: row.bugType,
      riskTier: row.riskTier,
      status: row.status,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(defaultValues);
  }

  async function onSubmit(values: FormValues) {
    if (editingId != null) {
      await bugTriageApi.update(token, featureId, editingId, values);
      notifySuccess('Bug triage updated');
    } else {
      await bugTriageApi.create(token, featureId, values);
      notifySuccess('Bug triage added');
    }
    cancelEdit();
    const list = await bugTriageApi.list(token, featureId);
    setRows(list);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Bug triage</CardTitle>
        <CardDescription>
          Classify issues as regression vs scouting gap — do not guess fixes for
          undecided behavior.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No bugs captured yet.</p>
        ) : (
          <ul className="grid gap-3">
            {rows.map((row) => (
              <li
                key={row.id}
                className="rounded-lg border border-border p-3 text-sm"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <Badge
                    variant={
                      row.bugType === 'SCOUTING_GAP'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {BUG_TRIAGE_TYPE_LABELS[row.bugType]}
                  </Badge>
                  <Badge variant="outline">
                    {BUG_TRIAGE_STATUS_LABELS[row.status]}
                  </Badge>
                  <Badge variant="outline">
                    {BUG_TRIAGE_RISK_LABELS[row.riskTier]}
                  </Badge>
                </div>
                <p className="font-medium">{row.whatHappened}</p>
                <p className="mt-1 text-muted-foreground">
                  Expected: {row.expected}
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-2 min-h-11"
                  onClick={() => startEdit(row)}
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        )}

        <form className="grid gap-4 border-t border-border pt-4" onSubmit={handleSubmit(onSubmit)}>
          <p className="text-sm font-medium">
            {editingId != null ? 'Edit bug' : 'Add bug'}
          </p>
          <FieldGroup>
            <Field data-invalid={!!errors.whatHappened}>
              <FieldLabel>What happened</FieldLabel>
              <Textarea
                className="min-h-16"
                maxLength={300}
                placeholder="One or two sentences"
                {...register('whatHappened')}
              />
              <FieldError>{errors.whatHappened?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.expected}>
              <FieldLabel>What you expected</FieldLabel>
              <Textarea
                className="min-h-16"
                maxLength={300}
                placeholder='Or write "not decided"'
                {...register('expected')}
              />
              <FieldError>{errors.expected?.message}</FieldError>
            </Field>

            <Field data-invalid={!!errors.reproduce}>
              <FieldLabel>Reproduce (optional)</FieldLabel>
              <Textarea
                className="min-h-16"
                maxLength={500}
                placeholder="Few short steps"
                {...register('reproduce')}
              />
              <FieldError>{errors.reproduce?.message}</FieldError>
            </Field>

            <div className="grid gap-4 sm:grid-cols-3">
              <Field data-invalid={!!errors.bugType}>
                <FieldLabel>Type</FieldLabel>
                <Controller
                  control={control}
                  name="bugType"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="min-h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUG_TRIAGE_TYPES.map((t) => (
                          <SelectItem key={t} value={t}>
                            {BUG_TRIAGE_TYPE_LABELS[t]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldDescription>
                  Scouting gap → escalate to PO.
                </FieldDescription>
                <FieldError>{errors.bugType?.message}</FieldError>
              </Field>

              <Field data-invalid={!!errors.riskTier}>
                <FieldLabel>Risk</FieldLabel>
                <Controller
                  control={control}
                  name="riskTier"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="min-h-11 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {BUG_TRIAGE_RISKS.map((r) => (
                          <SelectItem key={r} value={r}>
                            {BUG_TRIAGE_RISK_LABELS[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.riskTier?.message}</FieldError>
              </Field>

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
                        {BUG_TRIAGE_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {BUG_TRIAGE_STATUS_LABELS[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError>{errors.status?.message}</FieldError>
              </Field>
            </div>
          </FieldGroup>

          <div className="flex flex-wrap gap-2">
            <Button
              type="submit"
              className="min-h-11"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" />
                  Saving…
                </>
              ) : editingId != null ? (
                'Update bug'
              ) : (
                'Add bug'
              )}
            </Button>
            {editingId != null ? (
              <Button
                type="button"
                variant="outline"
                className="min-h-11"
                onClick={cancelEdit}
              >
                Cancel
              </Button>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
