import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  type Edge,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, Trash2 } from 'lucide-react';
import type { Feature, FeatureRelation } from '@scoutbook/types';
import { Button } from '@scoutbook/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@scoutbook/ui/components/select';
import { useAuth } from '@web/auth/AuthContext';
import {
  FeatureGraphNodeView,
  type FeatureGraphNode,
} from '@web/components/feature-graph-node';
import { PageHeader } from '@web/components/page-header';
import { featureRelationsApi, featuresApi, notifySuccess } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';

const nodeTypes = { feature: FeatureGraphNodeView };

function layoutNodes(features: Feature[]): FeatureGraphNode[] {
  const cols = Math.max(1, Math.ceil(Math.sqrt(features.length)));
  return features.map((feature, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    return {
      id: String(feature.id),
      type: 'feature',
      position: { x: col * 220, y: row * 110 },
      data: { feature },
    };
  });
}

function toEdges(relations: FeatureRelation[]): Edge[] {
  return relations.map((rel) => ({
    id: `rel-${rel.id}`,
    source: String(rel.fromFeatureId),
    target: String(rel.toFeatureId),
    label: 'blocks',
    markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
    style: { strokeWidth: 1.5 },
    data: { relationId: rel.id },
  }));
}

function DependencyGraphCanvas({
  features,
  relations,
  canEdit,
  onDeleteRelation,
}: {
  features: Feature[];
  relations: FeatureRelation[];
  canEdit: boolean;
  onDeleteRelation: (id: number) => Promise<void>;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState<FeatureGraphNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setNodes(layoutNodes(features));
    setEdges(toEdges(relations));
    setSelectedEdgeId(null);
  }, [features, relations, setNodes, setEdges]);

  const selectedRelationId = useMemo(() => {
    if (!selectedEdgeId) return null;
    const edge = edges.find((e) => e.id === selectedEdgeId);
    const id = edge?.data?.relationId;
    return typeof id === 'number' ? id : null;
  }, [edges, selectedEdgeId]);

  const onEdgeClick = useCallback((_: React.MouseEvent, edge: Edge) => {
    setSelectedEdgeId(edge.id);
  }, []);

  async function removeSelected() {
    if (selectedRelationId == null) return;
    setDeleting(true);
    try {
      await onDeleteRelation(selectedRelationId);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex min-h-[min(70vh,36rem)] flex-col gap-2">
      {canEdit && selectedRelationId != null ? (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm text-muted-foreground">Edge selected</p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-11"
            disabled={deleting}
            onClick={() => void removeSelected()}
          >
            <Trash2 className="size-4" />
            Remove BLOCKS link
          </Button>
        </div>
      ) : null}
      <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border bg-muted/20">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onEdgeClick={onEdgeClick}
          onPaneClick={() => setSelectedEdgeId(null)}
          nodeTypes={nodeTypes}
          fitView
          minZoom={0.35}
          proOptions={{ hideAttribution: true }}
          className="h-full min-h-[min(70vh,36rem)]"
        >
          <Background gap={16} size={1} />
          <Controls showInteractive={false} />
          <MiniMap pannable zoomable className="!bg-card" />
        </ReactFlow>
      </div>
    </div>
  );
}

export function DependencyGraphPage() {
  const { token, user } = useAuth();
  const canEdit = user?.role === 'PO' || user?.role === 'PM';
  const [features, setFeatures] = useState<Feature[]>([]);
  const [relations, setRelations] = useState<FeatureRelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromId, setFromId] = useState<string>('');
  const [toId, setToId] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const reload = useCallback(async (authToken: string) => {
    const [featureRows, relationRows] = await Promise.all([
      featuresApi.list(authToken),
      featureRelationsApi.list(authToken),
    ]);
    setFeatures(featureRows);
    setRelations(relationRows);
  }, []);

  useEffect(() => {
    if (!token) return;
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        await reload(token);
      } catch {
        if (!ctl.cancelled) {
          setFeatures([]);
          setRelations([]);
        }
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [token, reload]);

  async function addLink() {
    if (!token || !fromId || !toId) return;
    setSaving(true);
    try {
      await featureRelationsApi.create(token, {
        fromFeatureId: Number(fromId),
        toFeatureId: Number(toId),
        type: 'BLOCKS',
      });
      notifySuccess('BLOCKS link added');
      setFromId('');
      setToId('');
      await reload(token);
    } catch {
      // toast via interceptor
    } finally {
      setSaving(false);
    }
  }

  async function deleteRelation(id: number) {
    if (!token) return;
    await featureRelationsApi.remove(token, id);
    notifySuccess('BLOCKS link removed');
    await reload(token);
  }

  return (
    <>
      <PageHeader
        title="Dependency graph"
        description="Features as nodes. Directed BLOCKS edges show what is waiting on what."
      />

      {canEdit ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add BLOCKS link</CardTitle>
            <CardDescription>
              From blocks To — PO/PM only. Select an edge on the graph to remove.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <div className="grid w-full gap-1.5 sm:w-56">
              <span className="text-sm font-medium">From (blocker)</span>
              <Select value={fromId || undefined} onValueChange={setFromId}>
                <SelectTrigger className="min-h-11 w-full">
                  <SelectValue placeholder="Choose feature" />
                </SelectTrigger>
                <SelectContent>
                  {features.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid w-full gap-1.5 sm:w-56">
              <span className="text-sm font-medium">To (blocked)</span>
              <Select value={toId || undefined} onValueChange={setToId}>
                <SelectTrigger className="min-h-11 w-full">
                  <SelectValue placeholder="Choose feature" />
                </SelectTrigger>
                <SelectContent>
                  {features.map((f) => (
                    <SelectItem key={f.id} value={String(f.id)}>
                      {f.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              className="min-h-11 w-full sm:w-auto"
              disabled={saving || !fromId || !toId || fromId === toId}
              onClick={() => void addLink()}
            >
              Add link
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading graph…</p>
      ) : null}

      {!loading && features.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Network className="size-4" />
            </div>
            <CardTitle className="text-base">No features yet</CardTitle>
            <CardDescription>
              Create a Feature first, then add BLOCKS links here.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : null}

      {!loading && features.length > 0 ? (
        <ReactFlowProvider>
          <DependencyGraphCanvas
            features={features}
            relations={relations}
            canEdit={canEdit}
            onDeleteRelation={deleteRelation}
          />
        </ReactFlowProvider>
      ) : null}
    </>
  );
}
