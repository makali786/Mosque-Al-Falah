
import crypto from 'crypto';
import fs from 'fs';

const teamId = '94QM2H5CQQ';
const clientId = 'com.masjid.alfalah.web';
const keyId = 'L4MW66P246';
const privateKey = `-----BEGIN PRIVATE KEY-----
MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgG8jwVAU4iiqL6n0R
s1tTMcVyd5vNaQSgMz0/kSxcF8GgCgYIKoZIzj0DAQehRANCAARAoKzGQEpSkFbt
mHTYAalqyhkhIFPiGlAfvZTFAvwwbvKPFn3wdiHDynzWw3NlAtcWTIn2/Ef9+LGZ
AdpusihO
-----END PRIVATE KEY-----`;

function base64url(buf) {
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

const header = base64url(Buffer.from(JSON.stringify({ alg: 'ES256', kid: keyId })));
const now = Math.floor(Date.now() / 1000);
const payload = base64url(Buffer.from(JSON.stringify({
    iss: teamId,
    iat: now,
    exp: now + 15777000, // ~6 months
    aud: 'https://appleid.apple.com',
    sub: clientId,
})));

const signingInput = `${header}.${payload}`;
const sign = crypto.createSign('SHA256');
sign.update(signingInput);
sign.end();
const der = sign.sign({ key: privateKey, dsaEncoding: 'der' });

// Parse DER signature
let offset = 2;
offset += 1;
const rLen = der[offset]; offset += 1;
const rBytes = der.slice(offset, offset + rLen); offset += rLen;
offset += 1;
const sLen = der[offset]; offset += 1;
const sBytes = der.slice(offset, offset + sLen);

const rPad = Buffer.alloc(32);
const sPad = Buffer.alloc(32);
const r = rBytes[0] === 0 ? rBytes.slice(1) : rBytes;
const s = sBytes[0] === 0 ? sBytes.slice(1) : sBytes;
r.copy(rPad, 32 - r.length);
s.copy(sPad, 32 - s.length);

const jwt = `${signingInput}.${base64url(Buffer.concat([rPad, sPad]))}`;

console.log(jwt);
