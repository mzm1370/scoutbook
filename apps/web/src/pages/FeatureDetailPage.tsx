import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@scoutbook/ui/components/card';
import type { Feature } from '@scoutbook/types';
import { useAuth } from '../auth/AuthContext';
import { PageHeader } from '../components/page-header';
import { RiskBadge, StageBadge } from '../components/feature-badges';
import { featuresApi } from '../lib/api';

export function FeatureDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    const featureId = Number(id);
    if (!Number.isFinite(featureId)) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const row = await featuresApi.get(token!, featureId);
        if (!cancelled) setFeature(row);
      } catch {
        if (!cancelled) setFeature(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [token, id]);

  return (
    <>
      <PageHeader
        title={feature?.title ?? (loading ? 'Loading…' : 'Feature')}
        description={
          feature
            ? 'Problem, stage, and upcoming Scouting / RFC / RACI sections.'
            : undefined
        }
        actions={
          <Link
            to="/features"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            ← All features
          </Link>
        }
      />

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}

      {!loading && !feature ? (
        <p className="text-sm text-muted-foreground">Feature not found.</p>
      ) : null}

      {feature ? (
        <div className="grid gap-4">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center gap-2">
                <StageBadge stage={feature.currentStage} />
                <RiskBadge tier={feature.riskTier} />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription>Problem statement</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">
              {feature.problem}
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Scouting</CardTitle>
                <CardDescription>Ambiguity rows — Epic 2.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">RFC</CardTitle>
                <CardDescription>Design record — Epic 3.</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">RACI</CardTitle>
                <CardDescription>Role matrix — Epic 4.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}
