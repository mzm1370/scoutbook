import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Settings2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { DocsSyncConnection } from '@scoutbook/types';
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
import { useAuth } from '@web/auth/AuthContext';
import { PageHeader } from '@web/components/page-header';
import { docsSyncApi, notifySuccess } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';

const schema = z.object({
  repoUrl: z
    .string()
    .trim()
    .min(3, { error: 'Repo URL or owner/repo required' })
    .max(300),
  token: z.string().trim().max(500).optional(),
});

type FormValues = z.infer<typeof schema>;

export function SettingsPage() {
  const { token, user } = useAuth();
  const isPo = user?.role === 'PO';
  const [connection, setConnection] = useState<DocsSyncConnection | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { repoUrl: '', token: '' },
    mode: 'onTouched',
  });

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
            token: '',
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
    if (!connection?.hasToken && !(values.token && values.token.length >= 8)) {
      setError('token', {
        type: 'manual',
        message: 'PAT required on first connect (min 8 chars)',
      });
      return;
    }
    try {
      const payload: { repoUrl: string; token?: string } = {
        repoUrl: values.repoUrl,
      };
      if (values.token && values.token.length > 0) {
        payload.token = values.token;
      }
      const status = await docsSyncApi.upsertConnection(token, payload);
      setConnection(status);
      reset({ repoUrl: status.repoUrl ?? '', token: '' });
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
      reset({ repoUrl: '', token: '' });
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
              PAT is encrypted at rest. Sync opens a PR — never pushes to main.
              {!isPo
                ? ' Only a Product Owner can change this connection.'
                : null}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {connection?.configured ? (
              <p className="text-sm text-muted-foreground">
                Connected
                {connection.tokenLastFour
                  ? ` · token …${connection.tokenLastFour}`
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
                  <Field data-invalid={Boolean(errors.token)}>
                    <FieldLabel htmlFor="token">
                      Fine-grained PAT
                      {connection?.hasToken ? ' (leave blank to keep)' : ''}
                    </FieldLabel>
                    <Input
                      id="token"
                      type="password"
                      className="min-h-11"
                      placeholder={
                        connection?.hasToken
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
