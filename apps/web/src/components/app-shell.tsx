import { Link } from 'react-router-dom';
import { Button } from '@scoutbook/ui/components/button';
import type { ReactNode } from 'react';
import { useAuth } from '../auth/AuthContext';

export function AppShell({
  children,
  title,
  actions,
}: {
  children: ReactNode;
  title?: string;
  actions?: ReactNode;
}) {
  const { user, logout } = useAuth();

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to="/features"
            className="text-xs font-semibold tracking-[0.2em] text-primary uppercase no-underline"
          >
            Scoutbook
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link
              to="/features"
              className="text-muted-foreground no-underline hover:text-foreground"
            >
              Features
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {user.email} · {user.role}
            </span>
          ) : null}
          <Button type="button" variant="outline" size="sm" onClick={logout}>
            Sign out
          </Button>
        </div>
      </header>

      {(title || actions) && (
        <div className="flex flex-wrap items-end justify-between gap-3">
          {title ? (
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {title}
            </h1>
          ) : (
            <span />
          )}
          {actions}
        </div>
      )}

      {children}
    </div>
  );
}
