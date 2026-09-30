import {
  Handle,
  Position,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import { Link } from 'react-router-dom';
import type { Feature, FeatureStage, RiskTier } from '@scoutbook/types';
import { FEATURE_STAGE_LABELS } from '@web/lib/labels';

export type FeatureGraphNodeData = {
  feature: Feature;
};

export type FeatureGraphNode = Node<FeatureGraphNodeData, 'feature'>;

export function FeatureGraphNodeView({ data }: NodeProps<FeatureGraphNode>) {
  const { feature } = data;
  return (
    <div className="min-w-[10rem] max-w-[14rem] rounded-lg border border-border bg-card px-3 py-2 shadow-sm">
      <Handle
        type="target"
        position={Position.Left}
        className="!size-2 !border-border !bg-muted-foreground"
      />
      <Link
        to={`/features/${feature.id}`}
        className="block text-sm font-medium leading-snug text-foreground underline-offset-2 hover:underline"
      >
        {feature.title}
      </Link>
      <p className="mt-1 text-xs text-muted-foreground">
        {FEATURE_STAGE_LABELS[feature.currentStage as FeatureStage]} ·{' '}
        {feature.riskTier as RiskTier}
      </p>
      <Handle
        type="source"
        position={Position.Right}
        className="!size-2 !border-border !bg-muted-foreground"
      />
    </div>
  );
}
