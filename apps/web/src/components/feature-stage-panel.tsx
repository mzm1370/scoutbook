import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { nextFeatureStage, type Feature } from '@scoutbook/types';
import { Button } from '@scoutbook/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import { StageBadge } from '@web/components/feature-badges';
import { featuresApi, notifySuccess } from '@web/lib/api';

type Props = {
  feature: Feature;
  token: string;
  canAdvance: boolean;
  onAdvanced: (feature: Feature) => void;
};

export function FeatureStagePanel({
  feature,
  token,
  canAdvance,
  onAdvanced,
}: Props) {
  const [pending, setPending] = useState(false);
  const next = nextFeatureStage(feature.currentStage);

  async function advance() {
    if (!next) return;
    setPending(true);
    try {
      const updated = await featuresApi.advanceStage(token, feature.id, {
        stage: next,
      });
      notifySuccess(`Advanced to ${updated.currentStage}`);
      onAdvanced(updated);
    } catch {
      // Toast via interceptor
    } finally {
      setPending(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Lifecycle stage</CardTitle>
        <CardDescription>
          Forward one step at a time. Scouting → RFC needs clear scouting rows.
          RFC → RACI needs RFC check Not needed or Accepted. RACI → Implementation
          needs every RACI step to have at least one R and one A. Implementation →
          Testing needs an implementation log marked Ready for test. Testing →
          Review needs a testing checklist marked Passed. Review → Release needs
          a review checklist marked Approved.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Current</span>
          <StageBadge stage={feature.currentStage} />
          {next ? (
            <>
              <span className="text-muted-foreground">→ next</span>
              <StageBadge stage={next} />
            </>
          ) : (
            <span className="text-muted-foreground">Final stage</span>
          )}
        </div>

        {canAdvance && next ? (
          <Button
            type="button"
            className="min-h-11 w-full sm:w-auto"
            disabled={pending}
            onClick={() => void advance()}
          >
            {pending ? (
              <>
                <Loader2 className="animate-spin" />
                Advancing…
              </>
            ) : (
              `Advance to ${next}`
            )}
          </Button>
        ) : null}

        {!canAdvance && next ? (
          <p className="text-sm text-muted-foreground">
            Only PO or PM can advance the stage.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
