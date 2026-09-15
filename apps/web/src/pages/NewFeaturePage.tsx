import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { RISK_TIERS, type RiskTier } from '@scoutbook/types';
import { z } from 'zod';
import { Button } from '@scoutbook/ui/components/button';
import {
  Field,
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
import { useAuth } from '../auth/AuthContext';
import { AppShell } from '../components/app-shell';
import { featuresApi, notifySuccess } from '../lib/api';

const schema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { error: 'Title must be at least 3 characters' })
    .max(200),
  problem: z
    .string()
    .trim()
    .min(10, { error: 'Problem must be at least 10 characters' }),
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
    <AppShell
      title="New Feature"
      actions={
        <Link
          to="/features"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          Cancel
        </Link>
      }
    >
      <form
        className="mx-auto w-full max-w-xl space-y-4 rounded-xl border bg-card p-5"
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
              placeholder="Short name for the idea"
              {...register('title')}
            />
            <FieldError errors={[errors.title]} />
          </Field>

          <Field data-invalid={!!errors.problem}>
            <FieldLabel htmlFor="feature-problem">Problem</FieldLabel>
            <Textarea
              id="feature-problem"
              aria-invalid={!!errors.problem}
              disabled={isSubmitting}
              rows={5}
              placeholder="Why does this need to exist? What breaks without it?"
              {...register('problem')}
            />
            <FieldError errors={[errors.problem]} />
          </Field>

          <Field data-invalid={!!errors.riskTier}>
            <FieldLabel>Risk tier</FieldLabel>
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
                  <SelectTrigger aria-invalid={!!errors.riskTier}>
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    {RISK_TIERS.map((tier) => (
                      <SelectItem key={tier} value={tier}>
                        {tier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldError errors={[errors.riskTier]} />
          </Field>
        </FieldGroup>

        <Button type="submit" disabled={isSubmitting} className="w-full">
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
    </AppShell>
  );
}
