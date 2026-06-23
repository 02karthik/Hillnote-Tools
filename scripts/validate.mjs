#!/usr/bin/env node
// validate.mjs — structural validation for the Hillnote tools source.
//
// Runs in CI on every PR (and locally via `npm run validate`). It does NOT sign
// anything and needs no key: signing happens in the Hillnote website backend,
// which clones this repo. This script only checks that the source is well-formed
// so a contributor's PR will build cleanly there.
//
// Errors (✗) fail the build. Warnings (⚠) are surfaced but do not fail.
//
//   node scripts/validate.mjs

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);

const rel = (p) => p.replace(ROOT + '/', '');

// Top-level dirs that are not tools (skipped by the reverse-orphan check).
const NON_TOOL_DIRS = new Set([
  'node_modules', '.git', '.github', '.idea', '.claude', 'claude',
  'keys', 'screenshots', 'scripts', 'dist', 'templates',
]);

const DIR_RE = /^[a-z0-9][a-z0-9-]*$/;        // safe slug — no traversal, lowercase-kebab
const COLOR_RE = /^#[0-9a-fA-F]{6}$/;
const B64_RE = /^[A-Za-z0-9+/]+={0,2}$/;
// remote http(s) resource pulled into a tool (breaks "single-file / offline")
const REMOTE_RE = /(?:src|href)\s*=\s*["']https?:\/\/|url\(\s*["']?https?:\/\/|@import\s+["']?https?:\/\/|(?:fetch|import)\s*\(?\s*["']https?:\/\//gi;

// ── tools.json ────────────────────────────────────────────────────────────
const toolsPath = join(ROOT, 'tools.json');
if (!existsSync(toolsPath)) {
  err('tools.json is missing');
  report();
}
let catalog;
try {
  catalog = JSON.parse(readFileSync(toolsPath, 'utf8'));
} catch (e) {
  err(`tools.json is not valid JSON: ${e.message}`);
  report();
}

if (!Number.isInteger(catalog.catalogVersion) || catalog.catalogVersion < 1) {
  err(`catalogVersion must be a positive integer (got ${JSON.stringify(catalog.catalogVersion)})`);
}
if (!Array.isArray(catalog.tools) || catalog.tools.length === 0) {
  err('tools must be a non-empty array');
  report();
}

const seenDirs = new Set();
const seenNames = new Set();

for (const [i, t] of catalog.tools.entries()) {
  const where = `tools[${i}]${t && t.dir ? ` (${t.dir})` : ''}`;
  if (!t || typeof t !== 'object') { err(`${where}: not an object`); continue; }

  // required string fields
  for (const f of ['dir', 'name', 'description', 'glyph']) {
    if (typeof t[f] !== 'string' || t[f].trim() === '') err(`${where}: "${f}" must be a non-empty string`);
  }
  if (typeof t.color !== 'string' || !COLOR_RE.test(t.color)) err(`${where}: "color" must be a #rrggbb hex (got ${JSON.stringify(t.color)})`);
  if (!Number.isInteger(t.version) || t.version < 1) err(`${where}: "version" must be a positive integer (got ${JSON.stringify(t.version)})`);

  if (typeof t.dir === 'string') {
    if (!DIR_RE.test(t.dir)) err(`${where}: "dir" must be lowercase-kebab and contain no path separators`);
    if (seenDirs.has(t.dir)) err(`${where}: duplicate "dir" — already used`);
    seenDirs.add(t.dir);
  }
  if (typeof t.name === 'string') {
    if (seenNames.has(t.name)) warn(`${where}: duplicate "name" "${t.name}"`);
    seenNames.add(t.name);
  }

  // filesystem: tool folder, entry file, screenshot
  if (typeof t.dir === 'string' && DIR_RE.test(t.dir)) {
    const dirPath = join(ROOT, t.dir);
    if (!existsSync(dirPath) || !statSync(dirPath).isDirectory()) {
      err(`${where}: folder "${t.dir}/" does not exist`);
    } else {
      const entry = typeof t.entryPath === 'string' && t.entryPath ? t.entryPath : 'index.html';
      const entryPath = join(dirPath, entry);
      if (!existsSync(entryPath) || !statSync(entryPath).isFile()) {
        err(`${where}: entry file "${t.dir}/${entry}" does not exist`);
      } else {
        const html = readFileSync(entryPath, 'utf8');
        const remotes = [...new Set((html.match(REMOTE_RE) || []).map((s) => s.trim()))];
        if (remotes.length) {
          warn(`${where}: entry loads remote resource(s) — tools should be self-contained (the app's runtime CSP will block these): ${remotes.join(', ')}`);
        }
      }
    }
    const shot = join(ROOT, 'screenshots', `${t.dir}.webp`);
    if (!existsSync(shot)) err(`${where}: missing screenshots/${t.dir}.webp`);
  }
}

// ── keys/public-key.json ───────────────────────────────────────────────────
const pubPath = join(ROOT, 'keys', 'public-key.json');
if (!existsSync(pubPath)) {
  err('keys/public-key.json is missing');
} else {
  let pub;
  try { pub = JSON.parse(readFileSync(pubPath, 'utf8')); }
  catch (e) { err(`keys/public-key.json is not valid JSON: ${e.message}`); }
  if (pub) {
    if (typeof pub.keyId !== 'string' || !pub.keyId) err('public-key.json: "keyId" must be a non-empty string');
    if (pub.alg !== 'ecdsa-p256') err(`public-key.json: "alg" must be "ecdsa-p256" (got ${JSON.stringify(pub.alg)})`);
    if (typeof pub.publicKey !== 'string' || !B64_RE.test(pub.publicKey)) err('public-key.json: "publicKey" must be a base64 string');
    if (JSON.stringify(pub).includes('PRIVATE KEY')) err('public-key.json contains a PRIVATE KEY — never commit private key material');
  }
}

// ── no private-key material anywhere ───────────────────────────────────────
// Skip vendored/build dirs — npm packages ship .pem test fixtures that would
// false-positive, and they are never published as tool source anyway.
const SKIP_RECURSE = new Set(['node_modules', '.git', 'dist']);
(function scanForKeys(dir) {
  for (const ent of readdirSync(dir, { withFileTypes: true })) {
    if (ent.isDirectory()) {
      if (SKIP_RECURSE.has(ent.name)) continue;
      scanForKeys(join(dir, ent.name));
    } else if (ent.name.endsWith('.pem') || ent.name.endsWith('.key')) {
      err(`private-key-like file committed: ${rel(join(dir, ent.name))} — keys must never be in the repo`);
    }
  }
})(ROOT);

// ── reverse orphan checks (warnings) ───────────────────────────────────────
const shotsDir = join(ROOT, 'screenshots');
if (existsSync(shotsDir)) {
  for (const f of readdirSync(shotsDir)) {
    if (!f.endsWith('.webp')) continue;
    const slug = f.replace(/\.webp$/, '');
    if (!seenDirs.has(slug)) warn(`screenshots/${f} has no matching tool in tools.json`);
  }
}
for (const ent of readdirSync(ROOT, { withFileTypes: true })) {
  if (!ent.isDirectory() || NON_TOOL_DIRS.has(ent.name) || ent.name.startsWith('.')) continue;
  if (existsSync(join(ROOT, ent.name, 'index.html')) && !seenDirs.has(ent.name)) {
    warn(`folder "${ent.name}/" looks like a tool (has index.html) but is not registered in tools.json`);
  }
}

report();

function report() {
  for (const w of warnings) console.log(`⚠  ${w}`);
  for (const e of errors) console.log(`✗  ${e}`);
  if (!errors.length) {
    const n = Array.isArray(catalog?.tools) ? catalog.tools.length : 0;
    console.log(`\n✓ catalog valid — ${n} tool(s), catalogVersion ${catalog?.catalogVersion}${warnings.length ? `, ${warnings.length} warning(s)` : ''}`);
    process.exit(0);
  }
  console.log(`\n✗ validation failed — ${errors.length} error(s), ${warnings.length} warning(s)`);
  process.exit(1);
}
