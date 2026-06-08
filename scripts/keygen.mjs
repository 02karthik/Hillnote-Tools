#!/usr/bin/env node
/**
 * One-time ECDSA P-256 keypair generation for signing the tool catalog.
 *
 *   keys/ed25519-private.pem  — PRIVATE key (gitignored). Keep secret; also store
 *                               as the CATALOG_SIGNING_KEY CI secret.
 *   keys/public-key.json      — PUBLIC key (committed). Embedded in the Hillnote
 *                               app as a pinned trust anchor.
 *
 * Run: npm run keygen   (use --force to replace an existing key — invalidates
 * every previously published signature, so only do this for a deliberate rotation).
 */
import { generateKeyPairSync } from 'node:crypto';
import { writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const keysDir = join(root, 'keys');
const privPath = join(keysDir, 'ed25519-private.pem');
const pubPath = join(keysDir, 'public-key.json');

if (existsSync(privPath) && !process.argv.includes('--force')) {
  console.error(`Refusing to overwrite ${privPath}\n  (pass --force only for a deliberate key rotation).`);
  process.exit(1);
}

const now = new Date();
// "dev" marks this as a throwaway local key. Regenerate (drop the -dev) for production.
const keyId = `hillnote-dev-${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}`;

const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'P-256' });
const privPem = privateKey.export({ type: 'pkcs8', format: 'pem' });

// Store the public key as the 65-byte uncompressed EC point (0x04 || X || Y), base64.
// Both verifiers consume that directly: Android JCA (ECPoint) and iOS SecKey
// (kSecAttrKeyTypeECSECPrimeRandom).
const jwk = publicKey.export({ format: 'jwk' });
const point = Buffer.concat([
  Buffer.from([0x04]),
  Buffer.from(jwk.x, 'base64url'),
  Buffer.from(jwk.y, 'base64url'),
]);
if (point.length !== 65) throw new Error(`unexpected EC point length ${point.length}`);
const rawPublicKeyB64 = point.toString('base64');

mkdirSync(keysDir, { recursive: true });
writeFileSync(privPath, privPem, { mode: 0o600 });
writeFileSync(pubPath, JSON.stringify({
  keyId,
  alg: 'ecdsa-p256',
  publicKey: rawPublicKeyB64,
  createdAt: now.toISOString(),
}, null, 2) + '\n');

console.log(`✓ ${privPath}  (gitignored — keep secret)`);
console.log(`✓ ${pubPath}  (commit this)`);
console.log('');
console.log(`  keyId       ${keyId}`);
console.log(`  public key  ${rawPublicKeyB64}`);
console.log('');
console.log('Embed the public key in the app (PinnedKeys) and add the private key to CI:');
console.log(`  gh secret set CATALOG_SIGNING_KEY < ${privPath}`);
