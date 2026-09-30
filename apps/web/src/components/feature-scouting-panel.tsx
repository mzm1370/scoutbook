import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  SCOUTING_STATUSES,
  type ScoutingEntry,
  type ScoutingStatus,
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
import { notifySuccess, scoutingApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { SCOUTING_STATUS_LABELS } from '@web/lib/labels';

const schema = z
  .object({
    question: z.string().trim().min(2).max(200),
    currentState: z.string().trim().min(1).max(300),
    expected: z.string().trim().min(1).max(300),
    decision: z.string().trim().max(300),
    status: z.enum([
      'READY',
      'DECISION_REQUIRED',
      'INVESTIGATING',
      'BLOCKED',
    ]),
  })
  .superRefine((values, ctx) => {
    if (values.status === 'READY' && values.decision.length === 0) {
      ctx.addIssue({
        code: 'custom',
        path: ['decision'],
        message: 'Decision required when status is Ready',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const defaultValues: FormValues = {
  question: '',
  currentState: '',
  expected: '',
  decision: '',
  status: 'INVESTIGATING',
};

function statusBadgeVariant(
  status: ScoutingStatus,
): 'default' | 'secondary' | 'destructive' | 'outline' {
  switch (status) {
    case 'READY':
      return 'default';
    case 'DECISION_REQUIRED':
      return 'destructive';
    case 'BLOCKED':
      return 'outline';
    default:
      return 'secondary';
  }
}

type Props = {
  featureId: number;
  token: string;
};

export function FeatureScoutingPanel({ featureId, token }: Props) {
  const [entries, setEntries] = useState<ScoutingEntry[]>([]);
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

  async function reload() {
    setLoading(true);
    try {
      const rows = await scoutingApi.list(token, featureId);
      setEntries(rows);
    } catch {
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const rows = await scoutingApi.list(token, featureId);
        if (!ctl.cancelled) setEntries(rows);
      } catch {
        if (!ctl.cancelled) setEntries([]);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [featureId, token]);

  function startEdit(entry: ScoutingEntry) {
    setEditingId(entry.id);
    reset({
      question: entry.question,
      currentState: entry.currentState,
      expected: entry.expected,
      decision: entry.decision,
      status: entry.status,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    reset(defaultValues);
  }

  async function onSubmit(values: FormValues) {
    try {
      if (editingId !== null) {
        await scoutingApi.update(token, featureId, editingId, values);
        notifySuccess('Scouting row updated');
      } else {
        await scoutingApi.create(token, featureId, values);
        notifySuccess('Scouting row added');
      }
      cancelEdit();
      await reload();
    } catch {
      // Toast via interceptor
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Scouting</CardTitle>
        <CardDescription>
          Short rows only. Do not write tests for Decision required,
          Investigating, or Blocked behavior — escalate first.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading scouting…</p>
        ) : null}

        {!loading && entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No rows yet. Capture one unknown below.
          </p>
        ) : null}

        {!loading && entries.length > 0 ? (
          <ul className="grid gap-3">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="rounded-lg border bg-muted/30 p-3 sm:p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="text-sm font-medium">{entry.question}</p>
                  <Badge variant={statusBadgeVariant(entry.status)}>
                    {SCOUTING_STATUS_LABELS[entry.status]}
                  </Badge>
                </div>
                <dl className="mt-2 grid gap-1 text-sm text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Now: </span>
                    {entry.currentState}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">
                      Expected:{' '}
                    </span>
                    {entry.expected}
                  </div>
                  {entry.decision ? (
                    <div>
                      <span className="font-medium text-foreground">
                        Decision:{' '}
                      </span>
                      {entry.decision}
                    </div>
                  ) : null}
                </dl>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-3 min-h-11"
                  onClick={() => startEdit(entry)}
                >
                  Edit
                </Button>
              </li>
            ))}
          </ul>
        ) : null}

        <form
          className="grid gap-3 rounded-xl border p-3 sm:p-4"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <p className="text-sm font-medium">
            {editingId !== null ? 'Edit row' : 'Add row'}
          </p>
          <FieldGroup>
            <Field data-invalid={!!errors.question}>
              <FieldLabel htmlFor="scouting-question">Question</FieldLabel>
              <Input
                id="scouting-question"
                placeholder="What is still unclear?"
                maxLength={200}
                {...register('question')}
              />
              <FieldError errors={[errors.question]} />
            </Field>

            <Field data-invalid={!!errors.currentState}>
              <FieldLabel htmlFor="scouting-current">Current state</FieldLabel>
              <Textarea
                id="scouting-current"
                rows={2}
                placeholder="What happens today?"
                maxLength={300}
                {...register('currentState')}
              />
              <FieldError errors={[errors.currentState]} />
            </Field>

            <Field data-invalid={!!errors.expected}>
              <FieldLabel htmlFor="scouting-expected">Expected</FieldLabel>
              <Textarea
                id="scouting-expected"
                rows={2}
                placeholder="What should happen?"
                maxLength={300}
                {...register('expected')}
              />
              <FieldError errors={[errors.expected]} />
            </Field>

            <Field data-invalid={!!errors.decision}>
              <FieldLabel htmlFor="scouting-decision">Decision</FieldLabel>
              <Input
                id="scouting-decision"
                placeholder="PO answer (required when Ready)"
                maxLength={300}
                {...register('decision')}
              />
              <FieldError errors={[errors.decision]} />
            </Field>

            <Field data-invalid={!!errors.status}>
              <FieldLabel>Status</FieldLabel>
              <Controller
                control={control}
                name="status"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {SCOUTING_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {SCOUTING_STATUS_LABELS[status]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldDescription>
                Ready means PO confirmed — safe to test that behavior.
              </FieldDescription>
              <FieldError errors={[errors.status]} />
            </Field>
          </FieldGroup>

          <div className="flex flex-col gap-2 sm:flex-row">
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
              ) : editingId !== null ? (
                'Save changes'
              ) : (
                'Add row'
              )}
            </Button>
            {editingId !== null ? (
              <Button
                type="button"
                variant="outline"
                className="min-h-11 w-full sm:w-auto"
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
