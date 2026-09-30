import { useEffect, useState } from 'react';
import type { FeatureStageHistory } from '@scoutbook/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import { StageBadge } from '@web/components/feature-badges';
import { featuresApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { FEATURE_STAGE_LABELS } from '@web/lib/labels';

type Props = {
  featureId: number;
  token: string;
  /** Bump when stage changes so the timeline reloads */
  refreshKey: string;
};

function formatWhen(iso: string): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export function FeatureStageHistoryPanel({
  featureId,
  token,
  refreshKey,
}: Props) {
  const [rows, setRows] = useState<FeatureStageHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const list = await featuresApi.listStageHistory(token, featureId);
        if (!ctl.cancelled) setRows(list);
      } catch {
        if (!ctl.cancelled) setRows([]);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [featureId, token, refreshKey]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Stage history</CardTitle>
        <CardDescription>
          Who moved this Feature and when. Create starts at Idea.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : null}

        {!loading && rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No history yet.</p>
        ) : null}

        {!loading && rows.length > 0 ? (
          <ol className="space-y-3">
            {rows.map((row) => (
              <li
                key={row.id}
                className="flex flex-col gap-1 border-b border-border pb-3 last:border-0 last:pb-0 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-1"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  {row.fromStage ? (
                    <>
                      <StageBadge stage={row.fromStage} />
                      <span className="text-muted-foreground" aria-hidden>
                        →
                      </span>
                      <StageBadge stage={row.toStage} />
                    </>
                  ) : (
                    <>
                      <span className="text-muted-foreground">Created at</span>
                      <StageBadge stage={row.toStage} />
                    </>
                  )}
                </div>
                <p className="text-xs text-muted-foreground sm:ms-auto">
                  {row.fromStage
                    ? `${FEATURE_STAGE_LABELS[row.fromStage]} → ${FEATURE_STAGE_LABELS[row.toStage]}`
                    : FEATURE_STAGE_LABELS[row.toStage]}
                  {' · '}
                  user #{row.changedByUserId}
                  {' · '}
                  {formatWhen(row.createdAt)}
                </p>
              </li>
            ))}
          </ol>
        ) : null}
      </CardContent>
    </Card>
  );
}
