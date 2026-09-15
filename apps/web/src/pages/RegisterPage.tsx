import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { USER_ROLES, type UserRole } from '@scoutbook/types';
import { z } from 'zod';
import { Button } from '@scoutbook/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@scoutbook/ui/components/field';
import { Input } from '@scoutbook/ui/components/input';
import { useAuth } from '../auth/AuthContext';

const registerSchema = z.object({
  email: z.email({ error: 'Enter a valid email address' }),
  password: z
    .string()
    .min(8, { error: 'Password must be at least 8 characters' }),
  role: z.enum(['PO', 'PM', 'DEVELOPER', 'QA']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'DEVELOPER',
    },
    mode: 'onTouched',
  });

  if (user) return <Navigate to="/" replace />;

  async function onSubmit(values: RegisterFormValues) {
    try {
      await register(values);
      navigate('/', { replace: true });
    } catch {
      // Toast shown by HTTP interceptor
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background px-4 py-10">
      <Card className="mx-auto w-full max-w-md shadow-lg">
        <CardHeader>
          <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
            Scoutbook
          </p>
          <CardTitle className="text-2xl font-semibold tracking-tight">
            Create your account
          </CardTitle>
          <CardDescription>
            Join your team&apos;s written decision trail.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id="register-form"
            className="space-y-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <FieldGroup>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  aria-invalid={!!errors.email}
                  disabled={isSubmitting}
                  placeholder="you@team.example"
                  {...registerField('email')}
                />
                <FieldError errors={[errors.email]} />
              </Field>

              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="register-password">Password</FieldLabel>
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  disabled={isSubmitting}
                  {...registerField('password')}
                />
                <FieldError errors={[errors.password]} />
              </Field>

              <Field data-invalid={!!errors.role}>
                <FieldLabel htmlFor="register-role">Role</FieldLabel>
                <select
                  id="register-role"
                  className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50"
                  aria-invalid={!!errors.role}
                  disabled={isSubmitting}
                  {...registerField('role')}
                >
                  {USER_ROLES.map((role: UserRole) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                <FieldError errors={[errors.role]} />
              </Field>
            </FieldGroup>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-4 border-t-0 bg-transparent pt-0">
          <Button
            type="submit"
            form="register-form"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" aria-hidden />
                Creating…
              </>
            ) : (
              'Register'
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
