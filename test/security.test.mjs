import test from 'node:test';
import assert from 'node:assert/strict';
import { scryptSync } from 'node:crypto';
import { issueToken, verifyPassword, verifyToken } from '../src/security.mjs';

test('password and token verification', () => {
  const salt = '0123456789abcdef';
  const encoded = `${salt}:${scryptSync('strong-password', salt, 64).toString('hex')}`;
  assert.equal(verifyPassword('strong-password', encoded), true);
  assert.equal(verifyPassword('wrong-password', encoded), false);
  const token = issueToken('owner@example.com', 'a-long-test-secret');
  assert.equal(verifyToken(token, 'a-long-test-secret').sub, 'owner@example.com');
  assert.equal(verifyToken(token, 'wrong-secret'), null);
});

