import { useAuth } from '../auth/AuthContext';

export function HomePage() {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <main className="home-shell">
      <header className="home-header">
        <p className="brand">Scoutbook</p>
        <button type="button" className="ghost" onClick={logout}>
          Sign out
        </button>
      </header>
      <section className="home-hero">
        <h1>Decisions, written down.</h1>
        <p className="lede">
          Signed in as <strong>{user.email}</strong> · role{' '}
          <strong>{user.role}</strong>
        </p>
        <p className="muted">
          Feature board and RFC flows land next. Auth is ready.
        </p>
      </section>
    </main>
  );
}
