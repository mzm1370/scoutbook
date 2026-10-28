import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  DOCS_SYNC_AUTH_MODES,
  type DocsSyncAuthMode,
  type DocsSyncConnection,
  type UpsertDocsSyncConnectionRequest,
} from '@scoutbook/types';
import { z } from 'zod';
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
import { useAbility } from '@web/auth/AbilityContext';
import { useAuth } from '@web/auth/AuthContext';
import { PageHeader } from '@web/components/page-header';
import { docsSyncApi, notifySuccess } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';

const schema = z
  .object({
    repoUrl: z
      .string()
      .trim()
      .min(3, { error: 'Repo URL or owner/repo required' })
      .max(300),
    authMode: z.enum(['PAT', 'GITHUB_APP']),
    token: z.string().trim().max(500).optional(),
    githubAppId: z.string().trim().max(32).optional(),
    githubInstallationId: z.string().trim().max(32).optional(),
    githubAppPrivateKey: z.string().trim().max(16000).optional(),
  })
  .superRefine((values, ctx) => {
    if (values.authMode === 'PAT' && values.token && values.token.length < 8) {
      ctx.addIssue({
        code: 'custom',
        path: ['token'],
        message: 'PAT must be at least 8 characters',
      });
    }
  });

type FormValues = z.infer<typeof schema>;

const AUTH_MODE_LABELS: Record<DocsSyncAuthMode, string> = {
  PAT: 'Fine-grained PAT',
  GITHUB_APP: 'GitHub App (short-lived token)',
};

export function SettingsPage() {
  const { token } = useAuth();
  const ability = useAbility();
  const isPo = ability.can('manage', 'DocsSync');
  const [connection, setConnection] = useState<DocsSyncConnection | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      repoUrl: '',
      authMode: 'PAT',
      token: '',
      githubAppId: '',
      githubInstallationId: '',
      githubAppPrivateKey: '',
    },
    mode: 'onTouched',
  });

  const authMode = useWatch({ control, name: 'authMode' });

  useEffect(() => {
    if (!token) return;
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const status = await docsSyncApi.getConnection(token);
        if (!ctl.cancelled) {
          setConnection(status);
          reset({
            repoUrl: status.repoUrl ?? '',
            authMode: status.authMode ?? 'PAT',
            token: '',
            githubAppId: status.githubAppId ?? '',
            githubInstallationId: status.githubInstallationId ?? '',
            githubAppPrivateKey: '',
          });
        }
      } catch {
        if (!ctl.cancelled) setConnection(null);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [token, reset]);

  async function onSave(values: FormValues) {
    if (!token || !isPo) return;
    const sameMode = connection?.authMode === values.authMode;
    const hasCreds = Boolean(connection?.hasToken && sameMode);

    if (values.authMode === 'PAT') {
      if (!hasCreds && !(values.token && values.token.length >= 8)) {
        setError('token', {
          type: 'manual',
          message: 'PAT required on first connect (min 8 chars)',
        });
        return;
      }
    } else {
      const missingApp =
        !(values.githubAppId && values.githubAppId.length > 0) &&
        !connection?.githubAppId;
      const missingInstall =
        !(values.githubInstallationId && values.githubInstallationId.length > 0) &&
        !connection?.githubInstallationId;
      const missingKey =
        !(values.githubAppPrivateKey && values.githubAppPrivateKey.length >= 32) &&
        !hasCreds;
      if (missingApp) {
        setError('githubAppId', {
          type: 'manual',
          message: 'App id required',
        });
        return;
      }
      if (missingInstall) {
        setError('githubInstallationId', {
          type: 'manual',
          message: 'Installation id required',
        });
        return;
      }
      if (missingKey) {
        setError('githubAppPrivateKey', {
          type: 'manual',
          message: 'Private key PEM required on first App connect',
        });
        return;
      }
    }

    try {
      const payload: UpsertDocsSyncConnectionRequest = {
        repoUrl: values.repoUrl,
        authMode: values.authMode,
      };
      if (values.authMode === 'PAT') {
        if (values.token && values.token.length > 0) {
          payload.token = values.token;
        }
      } else {
        if (values.githubAppId) payload.githubAppId = values.githubAppId;
        if (values.githubInstallationId) {
          payload.githubInstallationId = values.githubInstallationId;
        }
        if (values.githubAppPrivateKey && values.githubAppPrivateKey.length > 0) {
          payload.githubAppPrivateKey = values.githubAppPrivateKey;
        }
      }
      const status = await docsSyncApi.upsertConnection(token, payload);
      setConnection(status);
      reset({
        repoUrl: status.repoUrl ?? '',
        authMode: status.authMode,
        token: '',
        githubAppId: status.githubAppId ?? '',
        githubInstallationId: status.githubInstallationId ?? '',
        githubAppPrivateKey: '',
      });
      notifySuccess('GitHub connection saved');
    } catch {
      // toast via interceptor
    }
  }

  async function onSync() {
    if (!token || !isPo) return;
    setSyncing(true);
    try {
      const result = await docsSyncApi.sync(token);
      notifySuccess(`PR opened (${result.filesWritten} files)`, result.prUrl);
      const status = await docsSyncApi.getConnection(token);
      setConnection(status);
    } catch {
      // toast via interceptor
    } finally {
      setSyncing(false);
    }
  }

  async function onDisconnect() {
    if (!token || !isPo) return;
    try {
      const status = await docsSyncApi.deleteConnection(token);
      setConnection(status);
      reset({
        repoUrl: '',
        authMode: 'PAT',
        token: '',
        githubAppId: '',
        githubInstallationId: '',
        githubAppPrivateKey: '',
      });
      notifySuccess('GitHub connection removed');
    } catch {
      // toast via interceptor
    }
  }

  return (
    <>
      <PageHeader
        title="Settings"
        description="Connect a GitHub repo so Feature docs sync as a pull request."
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}

      {!loading ? (
        <Card>
          <CardHeader>
            <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Settings2 className="size-4" />
            </div>
            <CardTitle className="text-base">GitHub Docs Sync</CardTitle>
            <CardDescription>
              Prefer a GitHub App for short-lived tokens; PAT still works.
              Secrets are encrypted at rest. Sync opens a PR — never pushes to
              main.
              {!isPo
                ? ' Only a Product Owner can change this connection.'
                : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {connection?.configured ? (
              <p className="text-sm text-muted-foreground">
                Connected · {AUTH_MODE_LABELS[connection.authMode]}
                {connection.tokenLastFour
                  ? ` · …${connection.tokenLastFour}`
                  : null}
                {connection.lastPrUrl ? (
                  <>
                    {' · '}
                    <a
                      href={connection.lastPrUrl}
                      className="underline underline-offset-2"
                      target="_blank"
                      rel="noreferrer"
                    >
                      last PR
                    </a>
                  </>
                ) : null}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Not configured yet.
              </p>
            )}

            {isPo ? (
              <form
                className="grid gap-4"
                onSubmit={handleSubmit((values) => void onSave(values))}
                noValidate
              >
                <FieldGroup>
                  <Field data-invalid={Boolean(errors.repoUrl)}>
                    <FieldLabel htmlFor="repoUrl">Repository</FieldLabel>
                    <Input
                      id="repoUrl"
                      className="min-h-11"
                      placeholder="https://github.com/owner/repo"
                      autoComplete="off"
                      {...register('repoUrl')}
                    />
                    <FieldDescription>
                      Full URL or owner/repo
                    </FieldDescription>
                    <FieldError errors={[errors.repoUrl]} />
                  </Field>

                  <Field data-invalid={Boolean(errors.authMode)}>
                    <FieldLabel>Auth mode</FieldLabel>
                    <Controller
                      control={control}
                      name="authMode"
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={(v) =>
                            field.onChange(v as DocsSyncAuthMode)
                          }
                        >
                          <SelectTrigger className="min-h-11 w-full">
                            <SelectValue placeholder="Auth mode" />
                          </SelectTrigger>
                          <SelectContent>
                            {DOCS_SYNC_AUTH_MODES.map((mode) => (
                              <SelectItem key={mode} value={mode}>
                                {AUTH_MODE_LABELS[mode]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    <FieldError errors={[errors.authMode]} />
                  </Field>

                  {authMode === 'PAT' ? (
                    <Field data-invalid={Boolean(errors.token)}>
                      <FieldLabel htmlFor="token">
                        Fine-grained PAT
                        {connection?.hasToken && connection.authMode === 'PAT'
                          ? ' (leave blank to keep)'
                          : ''}
                      </FieldLabel>
                      <Input
                        id="token"
                        type="password"
                        className="min-h-11"
                        placeholder={
                          connection?.hasToken && connection.authMode === 'PAT'
                            ? '••••••••'
                            : 'github_pat_…'
                        }
                        autoComplete="off"
                        {...register('token')}
                      />
                      <FieldDescription>
                        Needs contents + pull requests write on the repo
                      </FieldDescription>
                      <FieldError errors={[errors.token]} />
                    </Field>
                  ) : (
                    <>
                      <Field data-invalid={Boolean(errors.githubAppId)}>
                        <FieldLabel htmlFor="githubAppId">App id</FieldLabel>
                        <Input
                          id="githubAppId"
                          className="min-h-11"
                          placeholder="123456"
                          autoComplete="off"
                          {...register('githubAppId')}
                        />
                        <FieldError errors={[errors.githubAppId]} />
                      </Field>
                      <Field
                        data-invalid={Boolean(errors.githubInstallationId)}
                      >
                        <FieldLabel htmlFor="githubInstallationId">
                          Installation id
                        </FieldLabel>
                        <Input
                          id="githubInstallationId"
                          className="min-h-11"
                          placeholder="987654"
                          autoComplete="off"
                          {...register('githubInstallationId')}
                        />
                        <FieldError errors={[errors.githubInstallationId]} />
                      </Field>
                      <Field
                        data-invalid={Boolean(errors.githubAppPrivateKey)}
                      >
                        <FieldLabel htmlFor="githubAppPrivateKey">
                          Private key (PEM)
                          {connection?.hasToken &&
                          connection.authMode === 'GITHUB_APP'
                            ? ' (leave blank to keep)'
                            : ''}
                        </FieldLabel>
                        <Textarea
                          id="githubAppPrivateKey"
                          rows={4}
                          className="min-h-24 font-mono text-xs"
                          placeholder="-----BEGIN RSA PRIVATE KEY-----"
                          autoComplete="off"
                          {...register('githubAppPrivateKey')}
                        />
                        <FieldDescription>
                          Encrypted at rest; used only to mint installation
                          tokens at sync time
                        </FieldDescription>
                        <FieldError errors={[errors.githubAppPrivateKey]} />
                      </Field>
                    </>
                  )}
                </FieldGroup>

                <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                  <Button
                    type="submit"
                    className="min-h-11"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    Save connection
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    className="min-h-11"
                    disabled={
                      syncing || !connection?.configured || !connection.hasToken
                    }
                    onClick={() => void onSync()}
                  >
                    {syncing ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    Sync now
                  </Button>
                  {connection?.configured ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="min-h-11"
                      onClick={() => void onDisconnect()}
                    >
                      Disconnect
                    </Button>
                  ) : null}
                </div>
              </form>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}
