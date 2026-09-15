import { Button } from '@scoutbook/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import { useAuth } from '@web/auth/AuthContext';

export function HomePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">
          Scoutbook
        </p>
        <Button type="button" variant="outline" onClick={logout}>
          Sign out
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Decisions, written down.</CardTitle>
          <CardDescription>
            Signed in as <span className="font-medium text-foreground">{user.email}</span>{' '}
            · role <span className="font-medium text-foreground">{user.role}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Feature board and RFC flows land next. Auth is ready.
        </CardContent>
      </Card>
    </div>
  );
}
