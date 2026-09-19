import { createHmac, timingSafeEqual, scryptSync } from 'node:crypto';

const b64 = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

export function verifyPassword(password, encoded) {
  const [salt, expectedHex] = String(encoded || '').split(':');
  if (!salt || !expectedHex) return false;
  const actual = scryptSync(password, salt, 64);
  const expected = Buffer.from(expectedHex, 'hex');
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function issueToken(subject, secret, ttlSeconds = 900) {
  const payload = b64({ sub: subject, exp: Math.floor(Date.now() / 1000) + ttlSeconds });
  const signature = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyToken(token, secret) {
  const [payload, signature] = String(token || '').split('.');
  if (!payload || !signature) return null;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
  return decoded.exp > Date.now() / 1000 ? decoded : null;
}

