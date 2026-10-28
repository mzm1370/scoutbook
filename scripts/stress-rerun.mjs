#!/usr/bin/env node
/**
 * RFC 0039 — stress-rerun a single spec to prove/disprove flakes.
 *
 * Usage:
 *   pnpm test:stress -- --pkg api --file src/common/http/api-response.spec.ts --runs 20
 *   pnpm test:stress -- --pkg web --file src/lib/labels.spec.ts --runs 50
 *   pnpm test:stress -- --pkg web-e2e --file e2e/critical-journey.spec.ts --runs 10
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** @param {string[]} argv */
function parseArgs(argv) {
  /** @type {Record<string, string>} */
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--pkg' || a === '--file' || a === '--runs' || a === '-t' || a === '--testNamePattern') {
      const key = a === '-t' ? 'testNamePattern' : a.slice(2);
      out[key] = argv[++i] ?? '';
      continue;
    }
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      out[k] = v ?? 'true';
    }
  }
  return out;
}

function usage(msg) {
  if (msg) console.error(msg);
  console.error(`Usage:
  pnpm test:stress -- --pkg <api|web|web-e2e> --file <path-in-package> [--runs N] [-t pattern]

  --runs  1..500 (default 20)
`);
  process.exit(msg ? 1 : 0);
}

const args = parseArgs(process.argv.slice(2).filter((a) => a !== '--'));
const pkg = args.pkg;
const file = args.file;
const runs = Math.trunc(Number(args.runs ?? '20'));
const pattern = args.testNamePattern || args.t;

if (!pkg || !file) usage('Missing --pkg and/or --file');
if (!['api', 'web', 'web-e2e'].includes(pkg)) usage(`Invalid --pkg ${pkg}`);
if (!Number.isFinite(runs) || runs < 1 || runs > 500) usage('--runs must be 1..500');

const pkgDir =
  pkg === 'api'
    ? path.join(root, 'apps/api')
    : path.join(root, 'apps/web');
const target = path.join(pkgDir, file);
if (!fs.existsSync(target)) {
  usage(`File not found: ${path.relative(root, target)}`);
}

/**
 * @param {string} cmd
 * @param {string[]} cmdArgs
 * @param {string} cwd
 */
function runOnce(cmd, cmdArgs, cwd) {
  const r = spawnSync(cmd, cmdArgs, {
    cwd,
    stdio: 'inherit',
    shell: false,
    env: process.env,
  });
  return r.status === 0;
}

console.log(
  `stress-rerun: pkg=${pkg} file=${file} runs=${runs}${pattern ? ` pattern=${pattern}` : ''}`,
);

let pass = 0;
let fail = 0;

if (pkg === 'web-e2e') {
  const cmdArgs = ['exec', 'playwright', 'test', file, `--repeat-each=${runs}`];
  if (pattern) cmdArgs.push('-g', pattern);
  const ok = runOnce('pnpm', cmdArgs, pkgDir);
  if (ok) {
    pass = runs;
  } else {
    fail = 1;
    console.error('Playwright stress run failed (see output above).');
  }
} else {
  for (let i = 1; i <= runs; i++) {
    process.stdout.write(`\n── run ${i}/${runs} ──\n`);
    const cmdArgs = ['exec', 'vitest', 'run', file];
    if (pattern) cmdArgs.push('-t', pattern);
    const ok = runOnce('pnpm', cmdArgs, pkgDir);
    if (ok) pass += 1;
    else fail += 1;
  }
}

console.log(`\nstress-rerun summary: pass=${pass} fail=${fail} runs=${runs}`);
if (fail > 0) {
  console.error('FLAKY or FAILING — do not unskip yet (RFC 0038 / 0039).');
  process.exit(1);
}
console.log('Stable under stress — safe to consider unskip if quarantine issue is fixed.');
