import { useEffect, useState } from 'react';
import {
  FEATURE_PROCESS_TRACKS,
  RISK_TIERS,
  suggestedProcessTrack,
  type Feature,
  type FeatureProcessTrack,
  type RiskTier,
} from '@scoutbook/types';
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
import { TrackBadge } from '@web/components/feature-badges';
import { featuresApi, notifySuccess } from '@web/lib/api';
import {
  PROCESS_TRACK_LABELS,
  RISK_TIER_LABELS,
} from '@web/lib/labels';

const EDITABLE = new Set(['IDEA', 'SCOUTING', 'RFC', 'RACI']);

type Props = {
  feature: Feature;
  token: string;
  canUpdate: boolean;
  onUpdated: (feature: Feature) => void;
};

export function FeatureProcessTrackPanel({
  feature,
  token,
  canUpdate,
  onUpdated,
}: Props) {
  const editable = canUpdate && EDITABLE.has(feature.currentStage);
  const [riskTier, setRiskTier] = useState<RiskTier>(feature.riskTier);
  const [processTrack, setProcessTrack] = useState<FeatureProcessTrack>(
    feature.processTrack,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRiskTier(feature.riskTier);
    setProcessTrack(feature.processTrack);
  }, [feature.id, feature.riskTier, feature.processTrack, feature.updatedAt]);

  const dirty =
    riskTier !== feature.riskTier || processTrack !== feature.processTrack;

  async function onSave() {
    setSaving(true);
    try {
      const updated = await featuresApi.update(token, feature.id, {
        riskTier,
        processTrack,
      });
      onUpdated(updated);
      notifySuccess('Track updated', `${updated.processTrack} · ${updated.riskTier}`);
    } catch {
      // Toast from HttpClient
    } finally {
      setSaving(false);
    }
  }

  function onRiskChange(value: RiskTier) {
    setRiskTier(value);
    setProcessTrack(suggestedProcessTrack(value));
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center gap-2">
          <CardTitle className="text-base">Process track</CardTitle>
          <TrackBadge track={feature.processTrack} />
        </div>
        <CardDescription>
          Light = leave RFC with Not needed. RFC track = Accepted check + document.
          Locked after Implementation.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="track-risk">
            Risk
          </label>
          <Select
            value={riskTier}
            onValueChange={(v) => onRiskChange(v as RiskTier)}
            disabled={!editable || saving}
          >
            <SelectTrigger id="track-risk" className="min-h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RISK_TIERS.map((tier) => (
                <SelectItem key={tier} value={tier}>
                  {RISK_TIER_LABELS[tier]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium" htmlFor="track-process">
            Track
          </label>
          <Select
            value={processTrack}
            onValueChange={(v) => setProcessTrack(v as FeatureProcessTrack)}
            disabled={!editable || saving || riskTier === 'P1'}
          >
            <SelectTrigger id="track-process" className="min-h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FEATURE_PROCESS_TRACKS.map((track) => (
                <SelectItem
                  key={track}
                  value={track}
                  disabled={riskTier === 'P1' && track === 'LIGHT'}
                >
                  {PROCESS_TRACK_LABELS[track]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {editable ? (
          <Button
            type="button"
            className="min-h-11 touch-manipulation sm:col-span-2 sm:w-fit"
            disabled={!dirty || saving}
            onClick={() => void onSave()}
          >
            {saving ? 'Saving…' : 'Save track'}
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
