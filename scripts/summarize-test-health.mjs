#!/usr/bin/env node
/**
 * RFC 0040 — summarize Vitest JSON reports into Actions step summary + markdown.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const reportPaths = [
  path.join(root, 'apps/api/reports/vitest.json'),
  path.join(root, 'apps/web/reports/vitest.json'),
];

/**
 * @param {unknown} raw
 */
function statsFromVitestJson(raw) {
  if (!raw || typeof raw !== 'object') {
    return null;
  }
  const r = /** @type {Record<string, unknown>} */ (raw);
  // Vitest JSON reporter (modern): { testResults?, numTotalTests?, ... } or nested
  if (typeof r.numTotalTests === 'number') {
    return {
      total: r.numTotalTests,
      passed: Number(r.numPassedTests ?? 0),
      failed: Number(r.numFailedTests ?? 0),
      skipped: Number(r.numPendingTests ?? r.numSkippedTests ?? 0),
      durationMs: Number(r.totalTime ?? r.duration ?? 0),
    };
  }
  // Fallback: aggregate testResults[] (Jest-like)
  const results = Array.isArray(r.testResults) ? r.testResults : [];
  let total = 0;
  let passed = 0;
  let failed = 0;
  let skipped = 0;
  let durationMs = 0;
  for (const tr of results) {
    const row = /** @type {Record<string, unknown>} */ (tr);
    durationMs += Number(row.endTime ?? 0) - Number(row.startTime ?? 0);
    const assertions = Array.isArray(row.assertionResults)
      ? row.assertionResults
      : [];
    for (const a of assertions) {
      total += 1;
      const status = String(
        /** @type {Record<string, unknown>} */ (a).status ?? '',
      );
      if (status === 'passed') passed += 1;
      else if (status === 'failed') failed += 1;
      else skipped += 1;
    }
  }
  if (total === 0 && typeof r.success === 'boolean') {
    return null;
  }
  return { total, passed, failed, skipped, durationMs };
}

/** @type {{ pkg: string; stats: NonNullable<ReturnType<typeof statsFromVitestJson>> }[]} */
const rows = [];
for (const p of reportPaths) {
  if (!fs.existsSync(p)) continue;
  const raw = JSON.parse(fs.readFileSync(p, 'utf8'));
  const stats = statsFromVitestJson(raw);
  if (!stats) {
    console.warn(`Could not parse stats from ${path.relative(root, p)}`);
    continue;
  }
  const pkg = p.includes(`${path.sep}api${path.sep}`)
    ? '@scoutbook/api'
    : '@scoutbook/web';
  rows.push({ pkg, stats });
}

const outDir = path.join(root, 'reports');
fs.mkdirSync(outDir, { recursive: true });

let md = `# Test health summary\n\n`;
md += `_Generated for RFC 0040 dogfood — copy rates into Feature test health._\n\n`;
md += `| Package | Passed | Failed | Skipped | Total | Duration |\n`;
md += `|---|---:|---:|---:|---:|---:|\n`;

if (rows.length === 0) {
  md += `| _(no reports)_ | — | — | — | — | — |\n`;
  console.warn(
    'summarize-test-health: no vitest.json reports found (run tests with CI=true first)',
  );
} else {
  for (const { pkg, stats } of rows) {
    const sec =
      stats.durationMs > 0 ? `${(stats.durationMs / 1000).toFixed(1)}s` : '—';
    md += `| ${pkg} | ${stats.passed} | ${stats.failed} | ${stats.skipped} | ${stats.total} | ${sec} |\n`;
  }
  const fail = rows.reduce((n, r) => n + r.stats.failed, 0);
  const total = rows.reduce((n, r) => n + r.stats.total, 0);
  const failPct = total ? Math.round((fail / total) * 100) : 0;
  md += `\n**Rollup failure rate:** ${failPct}% (${fail}/${total} failed)\n`;
  md += `\n**Next:** open Feature → Test health; set failure %, flaky count from quarantine issues, duration from this table. See \`docs/process/test-health-telemetry.md\`.\n`;
}

const summaryPath = path.join(outDir, 'test-health-summary.md');
fs.writeFileSync(summaryPath, md);
console.log(md);

const stepSummary = process.env.GITHUB_STEP_SUMMARY;
if (stepSummary) {
  fs.appendFileSync(stepSummary, md + '\n');
}
