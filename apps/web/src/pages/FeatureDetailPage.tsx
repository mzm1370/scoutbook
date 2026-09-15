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
import { AppShell } from '../components/app-shell';
import { RiskBadge, StageBadge } from '../components/feature-badges';
import { ApiError, featuresApi } from '../lib/api';

export function FeatureDetailPage() {
  const { id } = useParams();
  const { token } = useAuth();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !id) return;
    const featureId = Number(id);
    if (!Number.isFinite(featureId)) {
      setError('Invalid feature id');
      setLoading(false);
      return;
    }

    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const row = await featuresApi.get(token!, featureId);
        if (!cancelled) setFeature(row);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof ApiError ? err.message : 'Failed to load feature');
        }
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
    <AppShell
      title={feature?.title ?? 'Feature'}
      actions={
        <Link
          to="/features"
          className="text-sm text-muted-foreground underline-offset-4 hover:underline"
        >
          ← All features
        </Link>
      }
    >
      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
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

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scouting</CardTitle>
              <CardDescription>
                Ambiguity rows land in Epic 2.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">RFC</CardTitle>
              <CardDescription>
                Structured design record lands in Epic 3.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">RACI</CardTitle>
              <CardDescription>
                Role matrix lands in Epic 4.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : null}
    </AppShell>
  );
}
