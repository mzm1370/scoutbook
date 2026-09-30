import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { DecisionNeededItem } from '@scoutbook/types';
import { Badge } from '@scoutbook/ui/components/badge';
import { Button } from '@scoutbook/ui/components/button';
import { useAuth } from '@web/auth/AuthContext';
import { RiskBadge, StageBadge } from '@web/components/feature-badges';
import { PageHeader } from '@web/components/page-header';
import { decisionsNeededApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { FEATURE_STAGE_LABELS } from '@web/lib/labels';

export function DecisionsNeededPage() {
  const { token, user } = useAuth();
  const [rows, setRows] = useState<DecisionNeededItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const list = await decisionsNeededApi.list(token);
        if (!ctl.cancelled) setRows(list);
      } catch {
        if (!ctl.cancelled) setRows([]);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [token]);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-4">
      <PageHeader
        title="Decisions Needed"
        description="Open scouting rows marked Decision required — resolve on the Feature, then they leave this inbox."
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/features">All features</Link>
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No Decision required rows right now.
          </p>
          <Button asChild className="mt-4 min-h-11 w-full sm:w-auto">
            <Link to="/board">Open board</Link>
          </Button>
        </div>
      ) : null}

      {!loading && rows.length > 0 ? (
        <ul className="grid gap-3">
          {rows.map((row) => (
            <li
              key={`${row.featureId}-${row.entryId}`}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="destructive">Decision required</Badge>
                <StageBadge stage={row.featureStage} />
                <RiskBadge tier={row.riskTier} />
              </div>

              <p className="mt-3 text-base font-medium leading-snug">
                {row.question}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Expected: {row.expected}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Current: {row.currentState}
              </p>

              <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 truncate text-sm">
                  <span className="text-muted-foreground">Feature · </span>
                  <span className="font-medium">{row.featureTitle}</span>
                  <span className="text-muted-foreground">
                    {' '}
                    ({FEATURE_STAGE_LABELS[row.featureStage]})
                  </span>
                </p>
                <Button asChild className="min-h-11 w-full sm:w-auto">
                  <Link to={`/features/${row.featureId}`}>
                    {user?.role === 'PO' || user?.role === 'PM'
                      ? 'Resolve on Feature'
                      : 'Open Feature'}
                  </Link>
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
