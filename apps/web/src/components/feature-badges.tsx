import { Badge } from '@scoutbook/ui/components/badge';
import type { FeatureStage, RiskTier } from '@scoutbook/types';

const stageVariant: Record<
  FeatureStage,
  'default' | 'secondary' | 'outline'
> = {
  IDEA: 'secondary',
  SCOUTING: 'outline',
  RFC: 'outline',
  RACI: 'outline',
  IMPLEMENTATION: 'default',
  TESTING: 'default',
  REVIEW: 'default',
  RELEASE: 'default',
};

export function StageBadge({ stage }: { stage: FeatureStage }) {
  return <Badge variant={stageVariant[stage]}>{stage}</Badge>;
}

export function RiskBadge({ tier }: { tier: RiskTier }) {
  return <Badge variant={tier === 'P1' ? 'destructive' : 'outline'}>{tier}</Badge>;
}
