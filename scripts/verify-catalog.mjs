#!/usr/bin/env node
/**
 * Verifies dist/catalog.json against dist/catalog.sig with the pinned public key
 * (keys/public-key.json) — exactly the two-gate check the Hillnote app performs:
 *
 *   Gate 1  ECDSA-P256 verify the signature over the RAW bytes of catalog.json.
 *           (Never reparse-then-reserialize before verifying — verify the bytes.)
 *   Gate 2  Re-hash every bundle and confirm it matches the catalog's sha256.
 *
 * Use as a post-deploy CI gate, and as the reference for SecureToolInstaller.
 */
import { createHash, createPublicKey, verify } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');

const pub = JSON.parse(readFileSync(join(root, 'keys', 'public-key.json'), 'utf8'));
const catalogBytes = readFileSync(join(dist, 'catalog.json'));                       // raw bytes
const sig = Buffer.from(readFileSync(join(dist, 'catalog.sig'), 'utf8').trim(), 'base64');

const point = Buffer.from(pub.publicKey, 'base64'); // 0x04 || X(32) || Y(32)
const pubKey = createPublicKey({
  key: {
    kty: 'EC', crv: 'P-256',
    x: point.subarray(1, 33).toString('base64url'),
    y: point.subarray(33, 65).toString('base64url'),
  },
  format: 'jwk',
});

if (!verify('sha256', catalogBytes, pubKey, sig)) {
  console.error('✗ Gate 1: signature INVALID');
  process.exit(1);
}
console.log(`✓ Gate 1: signature valid (keyId ${pub.keyId})`);

const catalog = JSON.parse(catalogBytes.toString('utf8'));
let bad = 0;
for (const t of catalog.tools) {
  const p = join(dist, t.bundle.url);
  if (!existsSync(p)) { console.error(`✗ missing bundle ${t.bundle.url}`); bad++; continue; }
  const h = createHash('sha256').update(readFileSync(p)).digest('hex');
  if (h !== t.bundle.sha256) { console.error(`✗ sha256 mismatch: ${t.dir}`); bad++; }
}
if (bad) process.exit(1);
console.log(`✓ Gate 2: ${catalog.tools.length} bundle hashes match`);
