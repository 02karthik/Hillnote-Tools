#!/usr/bin/env node
/**
 * Builds the signed Hillnote tool catalog.
 *
 *   reads   tools.json + each tool folder
 *   writes  dist/                       deployable static site (Pages)
 *           dist/bundles/<dir>-v<n>.zip  one deterministic zip per tool
 *           dist/catalog.json            machine catalog: per-tool sha256 + metadata
 *           dist/catalog.sig             ECDSA P-256 (SHA-256) signature over catalog.json's bytes
 *
 * Signing key: env CATALOG_SIGNING_KEY (PEM) in CI, else keys/ed25519-private.pem.
 * The app verifies catalog.sig over the EXACT bytes of catalog.json using the
 * pinned public key (keys/public-key.json), then trusts each bundle by sha256.
 */
import {
  createHash, createPrivateKey, createPublicKey, sign, verify,
} from 'node:crypto';
import {
  readFileSync, writeFileSync, rmSync, mkdirSync, readdirSync, existsSync, cpSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative, sep } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(root, 'dist');
const bundlesDir = join(distDir, 'bundles');

// ── deterministic STORE-only zip (fixed timestamps → byte-for-byte reproducible) ──
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** entries: [{ name, data:Buffer }], pre-sorted by name. */
function buildZip(entries) {
  const TIME = 0, DATE = 0x21; // 1980-01-01 00:00:00
  const parts = [];
  const central = [];
  let offset = 0;
  for (const { name, data } of entries) {
    const nameBuf = Buffer.from(name, 'utf8');
    const crc = crc32(data);

    const lh = Buffer.alloc(30);
    lh.writeUInt32LE(0x04034b50, 0);  // local file header signature
    lh.writeUInt16LE(20, 4);          // version needed
    lh.writeUInt16LE(0x0800, 6);      // flags: bit 11 = UTF-8 filename
    lh.writeUInt16LE(0, 8);           // method: 0 = store
    lh.writeUInt16LE(TIME, 10);
    lh.writeUInt16LE(DATE, 12);
    lh.writeUInt32LE(crc, 14);
    lh.writeUInt32LE(data.length, 18); // compressed size
    lh.writeUInt32LE(data.length, 22); // uncompressed size
    lh.writeUInt16LE(nameBuf.length, 26);
    lh.writeUInt16LE(0, 28);           // extra length
    parts.push(lh, nameBuf, data);

    const ch = Buffer.alloc(46);
    ch.writeUInt32LE(0x02014b50, 0);  // central directory header signature
    ch.writeUInt16LE(20, 4);          // version made by
    ch.writeUInt16LE(20, 6);          // version needed
    ch.writeUInt16LE(0x0800, 8);      // flags
    ch.writeUInt16LE(0, 10);          // method
    ch.writeUInt16LE(TIME, 12);
    ch.writeUInt16LE(DATE, 14);
    ch.writeUInt32LE(crc, 16);
    ch.writeUInt32LE(data.length, 20);
    ch.writeUInt32LE(data.length, 24);
    ch.writeUInt16LE(nameBuf.length, 28);
    ch.writeUInt32LE(0, 38);          // external attributes
    ch.writeUInt32LE(offset, 42);     // offset of local header
    central.push(ch, nameBuf);

    offset += lh.length + nameBuf.length + data.length;
  }
  const cd = Buffer.concat(central);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);  // end of central directory signature
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(cd.length, 12);  // size of central directory
  eocd.writeUInt32LE(offset, 16);     // offset of central directory (EOCD byte 16, not 14)
  return Buffer.concat([...parts, cd, eocd]);
}

function listFiles(dir) {
  const out = [];
  (function walk(d) {
    for (const ent of readdirSync(d, { withFileTypes: true })) {
      if (ent.name.startsWith('.')) continue; // skip .DS_Store etc.
      const full = join(d, ent.name);
      if (ent.isDirectory()) walk(full);
      else out.push(relative(dir, full).split(sep).join('/'));
    }
  })(dir);
  return out.sort();
}

// ── load inputs ───────────────────────────────────────────────────────────────
const pubPath = join(root, 'keys', 'public-key.json');
if (!existsSync(pubPath)) {
  console.error('Missing keys/public-key.json — run `npm run keygen` first.');
  process.exit(1);
}
const pub = JSON.parse(readFileSync(pubPath, 'utf8'));

const privPem = process.env.CATALOG_SIGNING_KEY || (() => {
  const p = join(root, 'keys', 'ed25519-private.pem');
  if (!existsSync(p)) {
    console.error('No signing key: set CATALOG_SIGNING_KEY or run `npm run keygen`.');
    process.exit(1);
  }
  return readFileSync(p, 'utf8');
})();

const toolsData = JSON.parse(readFileSync(join(root, 'tools.json'), 'utf8'));

// ── build bundles ───────────────────────────────────────────────────────────────
rmSync(distDir, { recursive: true, force: true });
mkdirSync(bundlesDir, { recursive: true });

const catalogTools = [];
for (const t of toolsData.tools) {
  const toolDir = join(root, t.dir);
  if (!existsSync(toolDir)) { console.error(`Tool folder missing: ${t.dir}`); process.exit(1); }

  const entryPath = t.entryPath || 'index.html';
  const names = listFiles(toolDir);
  if (!names.includes(entryPath)) {
    console.error(`Entry "${entryPath}" not found in ${t.dir}`); process.exit(1);
  }

  const zip = buildZip(names.map(name => ({ name, data: readFileSync(join(toolDir, name)) })));
  const zipName = `${t.dir}-v${t.version}.zip`;
  writeFileSync(join(bundlesDir, zipName), zip);
  const sha256 = createHash('sha256').update(zip).digest('hex');

  catalogTools.push({
    dir: t.dir,
    name: t.name,
    description: t.description || '',
    glyph: t.glyph || '',
    color: t.color || '',
    version: t.version,
    entryPath,
    bundle: { url: `bundles/${zipName}`, sha256, sizeBytes: zip.length },
  });
  console.log(`  • ${t.dir.padEnd(18)} ${String(zip.length).padStart(7)} B  ${sha256.slice(0, 16)}…  (${names.length} file${names.length > 1 ? 's' : ''})`);
}

// ── machine catalog + signature ─────────────────────────────────────────────────
const catalog = {
  schemaVersion: 1,
  catalogVersion: toolsData.catalogVersion ?? 1,
  keyId: pub.keyId,
  generatedAt: process.env.SOURCE_DATE_EPOCH
    ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
    : new Date().toISOString(),
  tools: catalogTools,
};
const catalogBytes = Buffer.from(JSON.stringify(catalog, null, 2) + '\n', 'utf8');
writeFileSync(join(distDir, 'catalog.json'), catalogBytes);

const signature = sign('sha256', catalogBytes, createPrivateKey(privPem));
writeFileSync(join(distDir, 'catalog.sig'), signature.toString('base64') + '\n');

// self-verify with the committed public key — catches a key/secret mismatch in CI early
const point = Buffer.from(pub.publicKey, 'base64'); // 0x04 || X(32) || Y(32)
const pubKey = createPublicKey({
  key: {
    kty: 'EC', crv: 'P-256',
    x: point.subarray(1, 33).toString('base64url'),
    y: point.subarray(33, 65).toString('base64url'),
  },
  format: 'jwk',
});
if (!verify('sha256', catalogBytes, pubKey, signature)) {
  console.error('✗ self-verification FAILED — signing key does not match keys/public-key.json');
  process.exit(1);
}

// ── assemble the deployable site ─────────────────────────────────────────────────
for (const item of ['index.html', 'tools.json', 'icon.svg', 'screenshots']) {
  if (existsSync(join(root, item))) cpSync(join(root, item), join(distDir, item), { recursive: true });
}
for (const t of toolsData.tools) {
  cpSync(join(root, t.dir), join(distDir, t.dir), { recursive: true });
}

console.log(`\n✓ ${catalogTools.length} tools • catalogVersion ${catalog.catalogVersion} • keyId ${catalog.keyId}`);
console.log(`✓ signature verified over catalog.json (${catalogBytes.length} bytes)`);
console.log('✓ dist/ ready to deploy');
