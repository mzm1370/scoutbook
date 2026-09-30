import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowRight, GitBranch } from 'lucide-react';
import { FEATURE_STAGES, type Feature, type FeatureStage } from '@scoutbook/types';
import { Badge } from '@scoutbook/ui/components/badge';
import { Button } from '@scoutbook/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import { useAuth } from '@web/auth/AuthContext';
import { PageHeader } from '@web/components/page-header';
import { featuresApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';
import { stageFlowNodes } from '@web/lib/lifecycle';

function countByStage(features: Feature[]): Record<FeatureStage, number> {
  const counts = Object.fromEntries(
    FEATURE_STAGES.map((s) => [s, 0]),
  ) as Record<FeatureStage, number>;
  for (const feature of features) {
    counts[feature.currentStage] += 1;
  }
  return counts;
}

export function LifecyclePage() {
  const { token } = useAuth();
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const nodes = useMemo(() => stageFlowNodes(), []);
  const counts = useMemo(() => countByStage(features), [features]);

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

  return (
    <>
      <PageHeader
        title="Lifecycle"
        description="Fixed eight-stage process. Advance one step at a time — never skip while ambiguous."
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link to="/board">Open board</Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GitBranch className="size-4" />
          </div>
          <CardTitle className="text-base">Process flowchart</CardTitle>
          <CardDescription>
            Idea → Release. Badges show Features currently in each stage
            {loading ? ' (loading…)' : ''}.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <ol className="flex flex-col items-stretch gap-1 md:flex-row md:flex-wrap md:items-center md:gap-2">
            {nodes.map((node, index) => (
              <li
                key={node.stage}
                className="flex flex-col items-stretch gap-1 md:flex-row md:items-center md:gap-2"
              >
                <div className="flex w-full min-w-0 flex-col gap-2 rounded-lg border border-border bg-card p-3 shadow-sm md:w-40">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(node.step).padStart(2, '0')}
                    </span>
                    <Badge variant="secondary">{counts[node.stage]}</Badge>
                  </div>
                  <p className="text-sm font-semibold leading-snug">
                    {node.label}
                  </p>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {node.purpose}
                  </p>
                </div>
                {index < nodes.length - 1 ? (
                  <>
                    <ArrowDown
                      className="mx-auto size-4 shrink-0 text-muted-foreground md:hidden"
                      aria-hidden
                    />
                    <ArrowRight
                      className="hidden size-4 shrink-0 text-muted-foreground md:block"
                      aria-hidden
                    />
                  </>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="text-xs text-muted-foreground">
            Forward only — Scouting, RFC, RACI, Implementation, Testing, and
            Review gates still apply when advancing on the board or Feature
            detail.
          </p>
        </CardContent>
      </Card>
    </>
  );
}
