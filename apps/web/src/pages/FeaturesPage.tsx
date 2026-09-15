import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@scoutbook/ui/components/button';
import { Skeleton } from '@scoutbook/ui/components/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@scoutbook/ui/components/table';
import type { Feature } from '@scoutbook/types';
import { useAuth } from '../auth/AuthContext';
import { PageHeader } from '../components/page-header';
import { RiskBadge, StageBadge } from '../components/feature-badges';
import { featuresApi } from '../lib/api';

export function FeaturesPage() {
  const { token, user } = useAuth();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const rows = await featuresApi.list(token!);
        if (!cancelled) setFeatures(rows);
      } catch {
        if (!cancelled) setFeatures([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <>
      <PageHeader
        title="Features"
        description="Short written ideas — problem, risk, stage. Add detail later."
        actions={
          user?.role === 'PO' ? (
            <Button asChild>
              <Link to="/features/new">New Feature</Link>
            </Button>
          ) : null
        }
      />

      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-xl md:h-12" />
          <Skeleton className="h-20 w-full rounded-xl md:h-12" />
          <Skeleton className="h-20 w-full rounded-xl md:h-12" />
        </div>
      ) : null}

      {!loading && features.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-10 text-center sm:px-6 sm:py-12">
          <p className="text-sm text-muted-foreground">
            No features yet.
            {user?.role === 'PO'
              ? ' Capture the first idea in under a minute.'
              : ' Ask a PO to add the first record.'}
          </p>
          {user?.role === 'PO' ? (
            <Button asChild className="mt-4 w-full sm:w-auto">
              <Link to="/features/new">New Feature</Link>
            </Button>
          ) : null}
        </div>
      ) : null}

      {/* Mobile: cards */}
      {!loading && features.length > 0 ? (
        <ul className="grid gap-3 md:hidden">
          {features.map((feature) => (
            <li key={feature.id}>
              <Link
                to={`/features/${feature.id}`}
                className="block rounded-xl border bg-card p-4 no-underline shadow-sm transition-colors hover:bg-muted/30"
              >
                <p className="font-medium text-foreground">{feature.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {feature.problem}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <StageBadge stage={feature.currentStage} />
                  <RiskBadge tier={feature.riskTier} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {/* Desktop: table */}
      {!loading && features.length > 0 ? (
        <div className="hidden overflow-hidden rounded-xl border bg-card md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>
                    <Link
                      to={`/features/${feature.id}`}
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {feature.title}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 max-w-md text-xs text-muted-foreground">
                      {feature.problem}
                    </p>
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={feature.currentStage} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge tier={feature.riskTier} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(feature.updatedAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </>
  );
}
