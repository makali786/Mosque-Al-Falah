/**
 * Apple Client Secret Generator
 *
 * Apple requires a JWT signed with your .p8 private key as the client_secret.
 * This module generates that JWT dynamically from the .p8 file so it never
 * needs to be stored as a static env variable.
 *
 * References:
 * - https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens
 * - https://next-auth.js.org/providers/apple
 */

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Base64URL encode a Buffer
 */
function base64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

/**
 * Generate an Apple client secret JWT.
 *
 * The JWT is signed with ES256 using the .p8 private key and is valid for
 * up to 6 months (Apple's maximum). NextAuth will use this as the
 * client_secret when exchanging the authorization code for tokens.
 */
export function generateAppleClientSecret(): string {
  const teamId = process.env.APPLE_TEAM_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const keyId = process.env.APPLE_KEY_ID;

  if (!teamId || !clientId || !keyId) {
    throw new Error(
      'Missing Apple env vars: APPLE_TEAM_ID, APPLE_CLIENT_ID, APPLE_KEY_ID are all required'
    );
  }

  // Read the private key — supports 3 methods (in priority order):
  // 1. APPLE_PRIVATE_KEY_PATH env var → path to .p8 file (local dev)
  // 2. APPLE_PRIVATE_KEY env var → inline PEM content (Vercel / CI)
  // 3. Default path: AuthKey_<keyId>.p8 in project root (local dev fallback)
  let privateKey: string;

  const keyPath = process.env.APPLE_PRIVATE_KEY_PATH;
  const inlineKey = process.env.APPLE_PRIVATE_KEY;

  if (keyPath) {
    const resolvedPath = path.resolve(process.cwd(), keyPath);
    if (fs.existsSync(resolvedPath)) {
      privateKey = fs.readFileSync(resolvedPath, 'utf8');
    } else {
      throw new Error(`Apple .p8 key file not found at: ${resolvedPath}`);
    }
  } else if (inlineKey) {
    // Support both raw key content and \n-escaped newlines (common in env vars)
    const pem = inlineKey.replace(/\\n/g, '\n');
    // Wrap in PEM headers if not already present
    if (pem.includes('-----BEGIN')) {
      privateKey = pem;
    } else {
      privateKey = `-----BEGIN PRIVATE KEY-----\n${pem}\n-----END PRIVATE KEY-----`;
    }
  } else {
    // Fallback: read from the default location in project root
    const defaultPath = path.resolve(process.cwd(), `AuthKey_${keyId}.p8`);
    if (fs.existsSync(defaultPath)) {
      privateKey = fs.readFileSync(defaultPath, 'utf8');
    } else {
      throw new Error(
        `Apple private key not found. Set APPLE_PRIVATE_KEY_PATH, APPLE_PRIVATE_KEY, or place AuthKey_${keyId}.p8 in the project root.`
      );
    }
  }

  // JWT Header
  const header = {
    alg: 'ES256',
    kid: keyId,
  };

  // JWT Payload
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 15777000, // 6 months (Apple's max)
    aud: 'https://appleid.apple.com',
    sub: clientId,
  };

  const encodedHeader = base64url(Buffer.from(JSON.stringify(header)));
  const encodedPayload = base64url(Buffer.from(JSON.stringify(payload)));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  // Sign with ES256 (ECDSA P-256 + SHA-256)
  const sign = crypto.createSign('SHA256');
  sign.update(signingInput);
  sign.end();

  const derSignature = sign.sign({ key: privateKey, dsaEncoding: 'der' });

  // Parse DER-encoded ECDSA signature: 30 <total_len> 02 <r_len> <r> 02 <s_len> <s>
  // Byte layout: [0]=0x30, [1]=total_len, [2]=0x02, [3]=r_len, [4..4+r_len-1]=r, ...
  let offset = 2; // skip 0x30 and total_len
  // skip 0x02 tag
  offset += 1;
  const rLen = derSignature[offset];
  offset += 1;
  const rBytes = derSignature.slice(offset, offset + rLen);
  offset += rLen;
  // skip 0x02 tag
  offset += 1;
  const sLen = derSignature[offset];
  offset += 1;
  const sBytes = derSignature.slice(offset, offset + sLen);

  // DER integers may have a leading 0x00 padding byte if the high bit is set
  // Strip it and pad to 32 bytes for the raw JWT signature
  const rPadded = Buffer.alloc(32);
  const sPadded = Buffer.alloc(32);
  const rStripped = rBytes[0] === 0 ? rBytes.slice(1) : rBytes;
  const sStripped = sBytes[0] === 0 ? sBytes.slice(1) : sBytes;
  rStripped.copy(rPadded, 32 - rStripped.length);
  sStripped.copy(sPadded, 32 - sStripped.length);

  const signature = base64url(Buffer.concat([rPadded, sPadded]));

  return `${signingInput}.${signature}`;
}
