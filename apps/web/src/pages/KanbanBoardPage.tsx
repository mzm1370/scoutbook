import { Loader2 } from 'lucide-react';
import { type DragEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import {
  FEATURE_STAGES,
  isImmediateNextStage,
  nextFeatureStage,
  type Feature,
  type FeatureStage,
} from '@scoutbook/types';
import { Button } from '@scoutbook/ui/components/button';
import { useAuth } from '@web/auth/AuthContext';
import { RiskBadge } from '@web/components/feature-badges';
import { PageHeader } from '@web/components/page-header';
import { featuresApi, notifySuccess } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { groupFeaturesByStage } from '@web/lib/kanban';
import { FEATURE_STAGE_LABELS } from '@web/lib/labels';

const DRAG_TYPE = 'application/x-scoutbook-feature-id';
/** Standard Kanban column / card width */
const COLUMN_WIDTH = 'w-72';

type CardProps = {
  feature: Feature;
  canAdvance: boolean;
  busy: boolean;
  onAdvance: (feature: Feature, target: FeatureStage) => void;
  onDragStart: (event: DragEvent, feature: Feature) => void;
  canDrag: boolean;
};

function BoardFeatureCard({
  feature,
  canAdvance,
  busy,
  onAdvance,
  onDragStart,
  canDrag,
}: CardProps) {
  const next = nextFeatureStage(feature.currentStage);

  return (
    <article
      draggable={canDrag && canAdvance && !!next}
      onDragStart={(e) => onDragStart(e, feature)}
      className={`w-full rounded-xl border border-border bg-card p-3 shadow-sm ${
        canDrag && canAdvance && next
          ? 'cursor-grab active:cursor-grabbing'
          : ''
      }`}
    >
      <Link
        to={`/features/${feature.id}`}
        className="block min-h-11 break-words py-1 text-sm font-medium leading-snug underline-offset-4 hover:underline"
      >
        {feature.title}
      </Link>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <RiskBadge tier={feature.riskTier} />
      </div>
      {canAdvance && next ? (
        <Button
          type="button"
          variant="outline"
          className="mt-3 min-h-11 w-full"
          disabled={busy}
          aria-label={`Advance to ${FEATURE_STAGE_LABELS[next]}`}
          onClick={() => onAdvance(feature, next)}
        >
          {busy ? (
            <>
              <Loader2 className="animate-spin" />
              Advancing…
            </>
          ) : (
            `Advance → ${FEATURE_STAGE_LABELS[next]}`
          )}
        </Button>
      ) : null}
    </article>
  );
}

export function KanbanBoardPage() {
  const { token, user } = useAuth();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [advancingId, setAdvancingId] = useState<number | null>(null);
  const [dragOverStage, setDragOverStage] = useState<FeatureStage | null>(
    null,
  );

  const canAdvance = user?.role === 'PO' || user?.role === 'PM';
  const byStage = groupFeaturesByStage(features);

  useEffect(() => {
    if (!token) return;
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const rows = await featuresApi.list(token);
        if (!ctl.cancelled) setFeatures(rows);
      } catch {
        if (!ctl.cancelled) setFeatures([]);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [token]);

  async function advanceFeature(feature: Feature, target: FeatureStage) {
    if (!token) return;
    if (!isImmediateNextStage(feature.currentStage, target)) {
      const hint = nextFeatureStage(feature.currentStage);
      toast.error('Advance one stage at a time', {
        description: hint
          ? `Move to ${FEATURE_STAGE_LABELS[hint]} only.`
          : 'Already at the final stage.',
      });
      return;
    }

    setAdvancingId(feature.id);
    try {
      const updated = await featuresApi.advanceStage(token, feature.id, {
        stage: target,
      });
      setFeatures((rows) =>
        rows.map((row) => (row.id === updated.id ? updated : row)),
      );
      notifySuccess(
        `Advanced to ${FEATURE_STAGE_LABELS[updated.currentStage]}`,
      );
    } catch {
      // toast via interceptor
    } finally {
      setAdvancingId(null);
    }
  }

  function onCardDragStart(event: DragEvent, feature: Feature) {
    if (!canAdvance) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.setData(DRAG_TYPE, String(feature.id));
    event.dataTransfer.effectAllowed = 'move';
  }

  function onColumnDragOver(event: DragEvent, stage: FeatureStage) {
    if (!canAdvance) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverStage(stage);
  }

  function onColumnDragLeave(stage: FeatureStage) {
    setDragOverStage((current) => (current === stage ? null : current));
  }

  async function onColumnDrop(event: DragEvent, stage: FeatureStage) {
    event.preventDefault();
    setDragOverStage(null);
    if (!canAdvance) return;

    const raw = event.dataTransfer.getData(DRAG_TYPE);
    const featureId = Number(raw);
    if (!Number.isFinite(featureId)) return;

    const feature = features.find((row) => row.id === featureId);
    if (!feature) return;
    if (feature.currentStage === stage) return;

    await advanceFeature(feature, stage);
  }

  return (
    <div className="flex w-full min-w-0 max-w-full flex-col gap-4">
      <PageHeader
        title="Board"
        description={
          canAdvance
            ? 'Page stays full width (no sideways scroll). Only the board strip scrolls; drag or Advance to move cards.'
            : 'Page stays full width (no sideways scroll). Only the board strip scrolls. Only PO or PM can advance.'
        }
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/features">List view</Link>
          </Button>
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading board…</p>
      ) : null}

      {!loading && features.length === 0 ? (
        <div className="w-full rounded-xl border border-dashed bg-muted/20 px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">
            No features on the board yet.
          </p>
          {user?.role === 'PO' ? (
            <Button asChild className="mt-4 min-h-11 w-full sm:w-auto">
              <Link to="/features/new">New Feature</Link>
            </Button>
          ) : null}
        </div>
      ) : null}

      {!loading && features.length > 0 ? (
        <div
          className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-2 [-webkit-overflow-scrolling:touch]"
          aria-label="Feature board"
        >
          <div className="flex w-max snap-x snap-mandatory gap-3">
            {FEATURE_STAGES.map((stage) => {
              const column = byStage[stage];
              const isDropTarget = dragOverStage === stage;
              return (
                <section
                  key={stage}
                  aria-label={FEATURE_STAGE_LABELS[stage]}
                  onDragOver={(e) => onColumnDragOver(e, stage)}
                  onDragLeave={() => onColumnDragLeave(stage)}
                  onDrop={(e) => void onColumnDrop(e, stage)}
                  className={`${COLUMN_WIDTH} flex shrink-0 snap-start flex-col rounded-xl border bg-muted/30 ${
                    isDropTarget
                      ? 'border-primary ring-2 ring-primary/30'
                      : 'border-border'
                  }`}
                >
                  <header className="flex items-center justify-between gap-2 border-b border-border/80 px-3 py-2.5">
                    <h2 className="truncate text-sm font-semibold tracking-tight">
                      {FEATURE_STAGE_LABELS[stage]}
                    </h2>
                    <span className="shrink-0 rounded-md bg-background px-2 py-0.5 text-xs text-muted-foreground tabular-nums">
                      {column.length}
                    </span>
                  </header>

                  <ul className="flex max-h-[min(70vh,42rem)] flex-col gap-2 overflow-y-auto overflow-x-hidden p-2">
                    {column.length === 0 ? (
                      <li className="px-2 py-8 text-center text-xs text-muted-foreground">
                        Empty
                      </li>
                    ) : (
                      column.map((feature) => (
                        <li key={feature.id} className="w-full">
                          <BoardFeatureCard
                            feature={feature}
                            canAdvance={canAdvance}
                            busy={advancingId === feature.id}
                            canDrag
                            onAdvance={(f, t) => void advanceFeature(f, t)}
                            onDragStart={onCardDragStart}
                          />
                        </li>
                      ))
                    )}
                  </ul>
                </section>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
