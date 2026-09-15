import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { RISK_TIERS, type RiskTier } from '@scoutbook/types';
import { z } from 'zod';
import { Button } from '@scoutbook/ui/components/button';
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
import { useAuth } from '@web/auth/AuthContext';
import { PageHeader } from '@web/components/page-header';
import { featuresApi, notifySuccess } from '@web/lib/api';
import { RISK_TIER_LABELS } from '@web/lib/labels';

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(2, { error: 'Give it a short name' })
    .max(200),
  problem: z
    .string()
    .trim()
    .min(5, { error: 'One short sentence is enough' })
    .max(500, { error: 'Keep it under 500 characters — deepen later in Scouting/RFC' }),
  riskTier: z.enum(['P1', 'P2', 'P3']),
});

type FormValues = z.infer<typeof schema>;

export function NewFeaturePage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      problem: '',
      riskTier: 'P2',
    },
    mode: 'onTouched',
  });

  const problemLen = watch('problem')?.length ?? 0;

  if (user && user.role !== 'PO') {
    return <Navigate to="/features" replace />;
  }

  async function onSubmit(values: FormValues) {
    if (!token) return;
    try {
      const created = await featuresApi.create(token, values);
      notifySuccess('Feature created', created.title);
      navigate(`/features/${created.id}`, { replace: true });
    } catch {
      // Toast shown by HTTP interceptor
    }
  }

  return (
    <>
      <PageHeader
        title="New Feature"
        description="Three short fields. You can add Scouting and RFC later."
        actions={
          <Button asChild variant="outline">
            <Link to="/features">Cancel</Link>
          </Button>
        }
      />

      <form
        className="mx-auto w-full max-w-xl space-y-4 rounded-xl border bg-card p-4 shadow-sm sm:p-5"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <FieldGroup>
          <Field data-invalid={!!errors.title}>
            <FieldLabel htmlFor="feature-title">Title</FieldLabel>
            <Input
              id="feature-title"
              autoFocus
              aria-invalid={!!errors.title}
              disabled={isSubmitting}
              placeholder="e.g. Docs sync"
              {...register('title')}
            />
            <FieldDescription>A few words is enough.</FieldDescription>
            <FieldError errors={[errors.title]} />
          </Field>

          <Field data-invalid={!!errors.problem}>
            <FieldLabel htmlFor="feature-problem">Problem</FieldLabel>
            <Textarea
              id="feature-problem"
              aria-invalid={!!errors.problem}
              disabled={isSubmitting}
              rows={3}
              maxLength={500}
              placeholder="e.g. Decisions never land in the repo docs/ folder."
              {...register('problem')}
            />
            <FieldDescription>
              One or two sentences. Detail comes later. ({problemLen}/500)
            </FieldDescription>
            <FieldError errors={[errors.problem]} />
          </Field>

          <Field data-invalid={!!errors.riskTier}>
            <FieldLabel>Risk</FieldLabel>
            <Controller
              control={control}
              name="riskTier"
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(value) =>
                    field.onChange(value as RiskTier)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger
                    className="min-h-10 w-full"
                    aria-invalid={!!errors.riskTier}
                  >
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_TIERS.map((tier) => (
                      <SelectItem key={tier} value={tier}>
                        {RISK_TIER_LABELS[tier]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldDescription>Guess now — change later if needed.</FieldDescription>
            <FieldError errors={[errors.riskTier]} />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="min-h-11 w-full touch-manipulation"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden />
              Creating…
            </>
          ) : (
            'Create Feature'
          )}
        </Button>
      </form>
    </>
  );
}
