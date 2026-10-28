#!/usr/bin/env node
/**
 * RFC 0038 — every skip/quarantine in specs must cite flaky:#<issue>.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const skipRe =
  /\b(?:it|test|describe)\.skip\s*\(|\btest\.skip\s*\(|\bxit\s*\(|\bxdescribe\s*\(/;
const flakyRe = /flaky:#(\d+)/i;
const fileRe = /\.(spec|test)\.(ts|tsx|js|jsx)$/;

/** @type {string[]} */
const errors = [];

/**
 * @param {string} dir
 * @returns {string[]}
 */
function walk(dir) {
  /** @type {string[]} */
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === 'node_modules' || ent.name === 'dist' || ent.name === '.git') {
      continue;
    }
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === 'e2e') {
        for (const f of walk(full)) out.push(f);
      } else {
        out.push(...walk(full));
      }
      continue;
    }
    if (fileRe.test(ent.name) || (dir.includes(`${path.sep}e2e`) && /\.tsx?$/.test(ent.name))) {
      out.push(full);
    }
  }
  return out;
}

const roots = ['apps', 'packages', 'scripts'].map((p) => path.join(root, p));
/** @type {string[]} */
const files = [];
for (const r of roots) files.push(...walk(r));

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    if (!skipRe.test(lines[i])) continue;
    const window = [lines[i - 1] ?? '', lines[i], lines[i + 1] ?? ''].join('\n');
    if (flakyRe.test(window)) continue;
    const rel = path.relative(root, file);
    errors.push(`${rel}:${i + 1}: skip/quarantine missing flaky:#<issue>`);
  }
}

if (errors.length) {
  console.error('Flaky quarantine check failed (RFC 0038):\n');
  for (const e of errors) console.error(`  ${e}`);
  console.error(
    '\nAdd flaky:#<n> to the test title or a // flaky:#n comment. See docs/process/flaky-quarantine.md',
  );
  process.exit(1);
}

console.log(`check:flaky OK (${files.length} files scanned, 0 bare skips)`);
