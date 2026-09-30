export function featureSlug(title: string, id: number): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return `${base || 'feature'}-${id}`;
}

export function escapeMdCell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

export type OverviewInput = {
  title: string;
  problem: string;
  currentStage: string;
  riskTier: string;
  id: number;
};

export function renderOverview(feature: OverviewInput): string {
  return [
    `# ${feature.title}`,
    '',
    `- Feature id: ${feature.id}`,
    `- Stage: ${feature.currentStage}`,
    `- Risk: ${feature.riskTier}`,
    '',
    '## Problem',
    '',
    feature.problem,
    '',
  ].join('\n');
}

export type ScoutingRow = {
  question: string;
  currentState: string;
  expected: string;
  decision: string;
  status: string;
};

export function renderScouting(title: string, rows: ScoutingRow[]): string {
  const lines = [
    `# ${title} — Scouting`,
    '',
    '| Question | Current | Expected | Decision | Status |',
    '|---|---|---|---|---|',
  ];
  for (const row of rows) {
    lines.push(
      `| ${escapeMdCell(row.question)} | ${escapeMdCell(row.currentState)} | ${escapeMdCell(row.expected)} | ${escapeMdCell(row.decision)} | ${escapeMdCell(row.status)} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

export type RfcCheckInput = {
  status: string;
  summary: string;
  changesSharedApi: boolean;
  newArchitecture: boolean;
  multiAppImpact: boolean;
  docPath: string;
};

export function renderRfcCheck(title: string, check: RfcCheckInput): string {
  return [
    `# ${title} — RFC check`,
    '',
    `- Status: ${check.status}`,
    `- Changes shared API: ${check.changesSharedApi ? 'yes' : 'no'}`,
    `- New architecture: ${check.newArchitecture ? 'yes' : 'no'}`,
    `- Multi-app impact: ${check.multiAppImpact ? 'yes' : 'no'}`,
    `- Doc path: ${check.docPath || '(none)'}`,
    '',
    '## Summary',
    '',
    check.summary || '(empty)',
    '',
  ].join('\n');
}

export type RaciRow = {
  stepName: string;
  poValue: string;
  pmValue: string;
  developerValue: string;
  qaValue: string;
};

export function renderRaci(title: string, rows: RaciRow[]): string {
  const lines = [
    `# ${title} — RACI`,
    '',
    '| Step | PO | PM | Developer | QA |',
    '|---|---|---|---|---|',
  ];
  for (const row of rows) {
    lines.push(
      `| ${escapeMdCell(row.stepName)} | ${row.poValue || '—'} | ${row.pmValue || '—'} | ${row.developerValue || '—'} | ${row.qaValue || '—'} |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

export type RelationEdge = {
  fromTitle: string;
  fromId: number;
  toTitle: string;
  toId: number;
};

export function renderRelations(edges: RelationEdge[]): string {
  const lines = [
    '# Feature relations (BLOCKS)',
    '',
    'Directed: **from** blocks **to**.',
    '',
  ];
  if (edges.length === 0) {
    lines.push('_No BLOCKS links._', '');
    return lines.join('\n');
  }
  lines.push('| From | To |', '|---|---|');
  for (const edge of edges) {
    lines.push(
      `| ${escapeMdCell(edge.fromTitle)} (#${edge.fromId}) | ${escapeMdCell(edge.toTitle)} (#${edge.toId}) |`,
    );
  }
  lines.push('');
  return lines.join('\n');
}

export type GeneratedFile = { path: string; content: string };

export type FeatureBundle = {
  feature: OverviewInput;
  scouting: ScoutingRow[];
  rfcCheck: RfcCheckInput | null;
  raci: RaciRow[];
};

export function generateDocsMarkdown(
  bundles: FeatureBundle[],
  relations: RelationEdge[],
): GeneratedFile[] {
  const files: GeneratedFile[] = [];
  for (const bundle of bundles) {
    const slug = featureSlug(bundle.feature.title, bundle.feature.id);
    const base = `docs/features/${slug}`;
    files.push({
      path: `${base}/overview.md`,
      content: renderOverview(bundle.feature),
    });
    if (bundle.scouting.length > 0) {
      files.push({
        path: `${base}/scouting.md`,
        content: renderScouting(bundle.feature.title, bundle.scouting),
      });
    }
    if (bundle.rfcCheck) {
      files.push({
        path: `${base}/rfc-check.md`,
        content: renderRfcCheck(bundle.feature.title, bundle.rfcCheck),
      });
    }
    if (bundle.raci.length > 0) {
      files.push({
        path: `${base}/raci.md`,
        content: renderRaci(bundle.feature.title, bundle.raci),
      });
    }
  }
  files.push({
    path: 'docs/scoutbook/feature-relations.md',
    content: renderRelations(relations),
  });
  return files;
}
