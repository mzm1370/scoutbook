import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@scoutbook/ui/components/card';
import type { Feature } from '@scoutbook/types';
import { useAuth } from '@web/auth/AuthContext';
import { FeatureImplementationLogPanel } from '@web/components/feature-implementation-log-panel';
import { FeatureRfcCheckPanel } from '@web/components/feature-rfc-check-panel';
import { FeatureRaciPanel } from '@web/components/feature-raci-panel';
import { FeatureReviewChecklistPanel } from '@web/components/feature-review-checklist-panel';
import { FeatureScoutingPanel } from '@web/components/feature-scouting-panel';
import { FeatureStagePanel } from '@web/components/feature-stage-panel';
import { FeatureTestingChecklistPanel } from '@web/components/feature-testing-checklist-panel';
import { PageHeader } from '@web/components/page-header';
import { RiskBadge, StageBadge } from '@web/components/feature-badges';
import { featuresApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';

export function FeatureDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [loading, setLoading] = useState(true);

  const canAdvance = user?.role === 'PO' || user?.role === 'PM';
  const featureId = id != null ? Number(id) : Number.NaN;
  const idOk = Number.isFinite(featureId);
  const canFetch = Boolean(token && idOk);

  useEffect(() => {
    if (!canFetch || !token) {
      return;
    }
    return startEffectAsync(async (ctl) => {
      setLoading(true);
      try {
        const row = await featuresApi.get(token, featureId);
        if (!ctl.cancelled) setFeature(row);
      } catch {
        if (!ctl.cancelled) setFeature(null);
      } finally {
        if (!ctl.cancelled) setLoading(false);
      }
    });
  }, [canFetch, token, featureId]);

  const showLoading = canFetch && loading;
  const notFound = !canFetch || (!loading && !feature);

  return (
    <>
      <PageHeader
        title={feature?.title ?? (showLoading ? 'Loading…' : 'Feature')}
        description={
          feature
            ? 'Capture unknowns in Scouting, then advance stages carefully.'
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

      {showLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : null}

      {!showLoading && notFound ? (
        <p className="text-sm text-muted-foreground">Feature not found.</p>
      ) : null}

      {feature && token ? (
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

          <FeatureStagePanel
            feature={feature}
            token={token}
            canAdvance={canAdvance}
            onAdvanced={setFeature}
          />

          <FeatureScoutingPanel featureId={feature.id} token={token} />

          <div className="grid gap-4 lg:grid-cols-2">
            <FeatureRfcCheckPanel
              featureId={feature.id}
              token={token}
              canAccept={canAdvance}
            />
            <FeatureRaciPanel featureId={feature.id} token={token} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <FeatureImplementationLogPanel
              featureId={feature.id}
              token={token}
            />
            <FeatureTestingChecklistPanel
              featureId={feature.id}
              token={token}
            />
          </div>

          <FeatureReviewChecklistPanel
            featureId={feature.id}
            token={token}
          />
        </div>
      ) : null}
    </>
  );
}
