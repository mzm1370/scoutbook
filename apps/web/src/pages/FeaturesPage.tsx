import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@scoutbook/ui/components/button';
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
        description="Every idea captured with a problem statement, risk tier, and stage."
        actions={
          user?.role === 'PO' ? (
            <Button asChild>
              <Link to="/features/new">New Feature</Link>
            </Button>
          ) : null
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading features…</p>
      ) : null}

      {!loading && features.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No features yet.
            {user?.role === 'PO'
              ? ' Create one to capture the first written idea.'
              : ' Ask a PO to create the first record.'}
          </p>
          {user?.role === 'PO' ? (
            <Button asChild className="mt-4">
              <Link to="/features/new">New Feature</Link>
            </Button>
          ) : null}
        </div>
      ) : null}

      {features.length > 0 ? (
        <div className="overflow-hidden rounded-xl border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Risk</TableHead>
                <TableHead className="hidden md:table-cell">Updated</TableHead>
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
                  </TableCell>
                  <TableCell>
                    <StageBadge stage={feature.currentStage} />
                  </TableCell>
                  <TableCell>
                    <RiskBadge tier={feature.riskTier} />
                  </TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {new Date(feature.updatedAt).toLocaleString()}
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
