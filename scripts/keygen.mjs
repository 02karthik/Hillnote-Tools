#!/usr/bin/env node
/**
 * One-time Ed25519 keypair generation for signing the tool catalog.
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

const { publicKey, privateKey } = generateKeyPairSync('ed25519');
const privPem = privateKey.export({ type: 'pkcs8', format: 'pem' });

// JWK 'x' is the base64url of the raw 32-byte public key — store it as plain base64,
// which is what BouncyCastle (Android) and CryptoKit (iOS) consume directly.
const jwk = publicKey.export({ format: 'jwk' });
const rawPublicKeyB64 = Buffer.from(jwk.x, 'base64url').toString('base64');

mkdirSync(keysDir, { recursive: true });
writeFileSync(privPath, privPem, { mode: 0o600 });
writeFileSync(pubPath, JSON.stringify({
  keyId,
  alg: 'ed25519',
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
