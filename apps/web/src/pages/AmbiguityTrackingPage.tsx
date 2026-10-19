import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  SCOUTING_STATUSES,
  type AmbiguityTrackingItem,
  type ScoutingStatus,
} from '@scoutbook/types';
import { Button } from '@scoutbook/ui/components/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@scoutbook/ui/components/table';
import { useAuth } from '@web/auth/AuthContext';
import { RiskBadge, StageBadge } from '@web/components/feature-badges';
import { PageHeader } from '@web/components/page-header';
import { ambiguityTrackingApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { SCOUTING_STATUS_LABELS } from '@web/lib/labels';
import { Badge } from '@scoutbook/ui/components/badge';

function StatusBadge({ status }: { status: ScoutingStatus }) {
  const variant =
    status === 'READY'
      ? 'default'
      : status === 'DECISION_REQUIRED'
        ? 'destructive'
        : 'outline';
  return <Badge variant={variant}>{SCOUTING_STATUS_LABELS[status]}</Badge>;
}

export function AmbiguityTrackingPage() {
  const { token } = useAuth();
  const [filter, setFilter] = useState<ScoutingStatus | 'ALL'>('ALL');
  const [rows, setRows] = useState<AmbiguityTrackingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const list = await ambiguityTrackingApi.list(
          token,
          filter === 'ALL' ? undefined : [filter],
        );
        if (!ctl.cancelled) setRows(list);
      } catch {
        if (!ctl.cancelled) setRows([]);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [token, filter]);

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-4">
      <PageHeader
        title="Ambiguity tracking"
        description="Current vs expected vs PO decision across Features. Do not treat Decision required, Investigating, or Blocked rows as final test specs."
        actions={
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/decisions">Decisions inbox</Link>
            </Button>
            <Button asChild variant="outline" className="min-h-11">
              <Link to="/features">All features</Link>
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={filter === 'ALL' ? 'default' : 'outline'}
          className="min-h-11 touch-manipulation"
          onClick={() => setFilter('ALL')}
        >
          All
        </Button>
        {SCOUTING_STATUSES.map((status) => (
          <Button
            key={status}
            type="button"
            size="sm"
            variant={filter === status ? 'default' : 'outline'}
            className="min-h-11 touch-manipulation"
            onClick={() => setFilter(status)}
          >
            {SCOUTING_STATUS_LABELS[status]}
          </Button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}

      {!loading && rows.length === 0 ? (
        <div className="rounded-xl border border-dashed bg-muted/20 px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No scouting rows
            {filter === 'ALL' ? '' : ` with status ${SCOUTING_STATUS_LABELS[filter]}`}
            .
          </p>
          <Button asChild className="mt-4 min-h-11 w-full sm:w-auto">
            <Link to="/features">Open Features</Link>
          </Button>
        </div>
      ) : null}

      {!loading && rows.length > 0 ? (
        <>
          <ul className="grid gap-3 lg:hidden">
            {rows.map((row) => (
              <li
                key={`${row.featureId}-${row.entryId}`}
                className="rounded-xl border border-border bg-card p-4 shadow-sm"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={row.status} />
                  <StageBadge stage={row.featureStage} />
                  <RiskBadge tier={row.riskTier} />
                </div>
                <p className="mt-3 text-base font-medium leading-snug">
                  {row.question}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Current: {row.currentState}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Expected: {row.expected}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Decision: {row.decision.trim() || '—'}
                </p>
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="min-w-0 truncate text-sm font-medium">
                    {row.featureTitle}
                  </p>
                  <Button asChild className="min-h-11 w-full sm:w-auto">
                    <Link to={`/features/${row.featureId}`}>Open Feature</Link>
                  </Button>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto rounded-xl border bg-card lg:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Feature</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={`${row.featureId}-${row.entryId}`}>
                    <TableCell className="max-w-[10rem]">
                      <Link
                        to={`/features/${row.featureId}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        {row.featureTitle}
                      </Link>
                      <div className="mt-1">
                        <StageBadge stage={row.featureStage} />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[12rem] text-sm">
                      {row.question}
                    </TableCell>
                    <TableCell className="max-w-[10rem] text-sm text-muted-foreground">
                      {row.currentState}
                    </TableCell>
                    <TableCell className="max-w-[10rem] text-sm text-muted-foreground">
                      {row.expected}
                    </TableCell>
                    <TableCell className="max-w-[10rem] text-sm">
                      {row.decision.trim() || '—'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={row.status} />
                    </TableCell>
                    <TableCell>
                      <RiskBadge tier={row.riskTier} />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild size="sm" className="min-h-11">
                        <Link to={`/features/${row.featureId}`}>Open</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      ) : null}
    </div>
  );
}
