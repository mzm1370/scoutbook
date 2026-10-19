import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from '@scoutbook/ui/components/card';
import {
  canRaciLetter,
  type Feature,
  type RaciAssignment,
} from '@scoutbook/types';
import { useAbility } from '@web/auth/AbilityContext';
import { useAuth } from '@web/auth/AuthContext';
import { FeatureImplementationLogPanel } from '@web/components/feature-implementation-log-panel';
import { FeatureBugTriagePanel } from '@web/components/feature-bug-triage-panel';
import { FeatureProcessTrackPanel } from '@web/components/feature-process-track-panel';
import { FeatureRfcCheckPanel } from '@web/components/feature-rfc-check-panel';
import { FeatureRfcDocumentPanel } from '@web/components/feature-rfc-document-panel';
import { FeatureRaciPanel } from '@web/components/feature-raci-panel';
import { FeatureReleaseLogPanel } from '@web/components/feature-release-log-panel';
import { FeatureReviewChecklistPanel } from '@web/components/feature-review-checklist-panel';
import { FeatureScoutingPanel } from '@web/components/feature-scouting-panel';
import { FeatureStageHistoryPanel } from '@web/components/feature-stage-history-panel';
import { FeatureStagePanel } from '@web/components/feature-stage-panel';
import { FeatureTestingChecklistPanel } from '@web/components/feature-testing-checklist-panel';
import { PageHeader } from '@web/components/page-header';
import { RiskBadge, StageBadge, TrackBadge } from '@web/components/feature-badges';
import { featuresApi } from '@web/lib/api';
import { startEffectAsync } from '@web/lib/effect-async';

export function FeatureDetailPage() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const ability = useAbility();
  const [feature, setFeature] = useState<Feature | null>(null);
  const [raciRows, setRaciRows] = useState<RaciAssignment[]>([]);
  const [loading, setLoading] = useState(true);

  const canAdvance = ability.can('advance', 'Feature');
  const canUpdateFeature = ability.can('update', 'Feature');
  const role = user?.role;
  const canAcceptRfc =
    ability.can('accept', 'RfcCheck') &&
    (role ? canRaciLetter(role, raciRows, 'acceptRfc') : false);
  const canDecideRfcDoc =
    ability.can('accept', 'RfcDocument') &&
    (role ? canRaciLetter(role, raciRows, 'acceptRfc') : false);
  const canUpdateScouting = role
    ? canRaciLetter(role, raciRows, 'updateScouting')
    : false;
  const canUpdateImplLog = role
    ? canRaciLetter(role, raciRows, 'updateImplementationLog')
    : false;
  const canUpdateTesting = role
    ? canRaciLetter(role, raciRows, 'updateTestingChecklist')
    : false;
  const canUpdateReview = role
    ? canRaciLetter(role, raciRows, 'updateReviewChecklist')
    : false;
  const canUpdateRelease = role
    ? canRaciLetter(role, raciRows, 'updateReleaseLog')
    : false;
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
                <TrackBadge track={feature.processTrack} />
              </div>
              <CardTitle className="text-xl">{feature.title}</CardTitle>
              <CardDescription>Problem statement</CardDescription>
            </CardHeader>
            <CardContent className="whitespace-pre-wrap text-sm leading-relaxed">
              {feature.problem}
            </CardContent>
          </Card>

          <FeatureProcessTrackPanel
            feature={feature}
            token={token}
            canUpdate={canUpdateFeature}
            onUpdated={setFeature}
          />

          <FeatureStagePanel
            feature={feature}
            token={token}
            canAdvance={canAdvance}
            onAdvanced={setFeature}
          />

          <FeatureStageHistoryPanel
            featureId={feature.id}
            token={token}
            refreshKey={`${feature.currentStage}:${feature.updatedAt}`}
          />

          <FeatureScoutingPanel
            featureId={feature.id}
            token={token}
            canWrite={canUpdateScouting}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <FeatureRfcCheckPanel
              featureId={feature.id}
              token={token}
              canAccept={canAcceptRfc}
              processTrack={feature.processTrack}
            />
            <FeatureRfcDocumentPanel
              featureId={feature.id}
              token={token}
              canDecide={canDecideRfcDoc}
              processTrack={feature.processTrack}
            />
          </div>

          <FeatureRaciPanel
            featureId={feature.id}
            token={token}
            onRowsChange={setRaciRows}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <FeatureImplementationLogPanel
              featureId={feature.id}
              token={token}
              canWrite={canUpdateImplLog}
            />
            <FeatureTestingChecklistPanel
              featureId={feature.id}
              token={token}
              canWrite={canUpdateTesting}
            />
          </div>

          <FeatureReviewChecklistPanel
            featureId={feature.id}
            token={token}
            canWrite={canUpdateReview}
          />

          <div className="grid gap-4 lg:grid-cols-2">
            <FeatureReleaseLogPanel
              featureId={feature.id}
              token={token}
              canWrite={canUpdateRelease}
            />
            <FeatureBugTriagePanel
              featureId={feature.id}
              token={token}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
