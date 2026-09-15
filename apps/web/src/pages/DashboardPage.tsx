import { Link } from 'react-router-dom';
import { ArrowRight, ClipboardList, FileText, Shield } from 'lucide-react';
import { Button } from '@scoutbook/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import { useAuth } from '../auth/AuthContext';
import { PageHeader } from '../components/page-header';

const stages = [
  'Idea',
  'Scouting',
  'RFC',
  'RACI',
  'Implementation',
  'Testing',
  'Review',
  'Release',
] as const;

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title="Dashboard"
        description={`Welcome back${user ? `, ${user.email.split('@')[0]}` : ''}. Short writes. Clear stages.`}
        actions={
          user?.role === 'PO' ? (
            <Button asChild>
              <Link to="/features/new">
                New Feature
                <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button asChild variant="outline">
              <Link to="/features">Browse features</Link>
            </Button>
          )
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardList className="size-4" />
            </div>
            <CardTitle className="text-base">Features</CardTitle>
            <CardDescription>
              Ideas with problem, risk tier, and stage.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="outline" size="sm">
              <Link to="/features">Open list</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="opacity-80">
          <CardHeader>
            <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <FileText className="size-4" />
            </div>
            <CardTitle className="text-base">Scouting & RFC</CardTitle>
            <CardDescription>
              Ambiguity rows and design records — Epics 2–3.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="opacity-80">
          <CardHeader>
            <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <Shield className="size-4" />
            </div>
            <CardTitle className="text-base">RACI & Board</CardTitle>
            <CardDescription>
              Role matrix and Kanban — Epics 4–5.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Process pipeline</CardTitle>
          <CardDescription>
            Every feature moves through the same eight stages.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-wrap">
            {stages.map((stage, index) => (
              <li
                key={stage}
                className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-medium">{stage}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>
    </>
  );
}
