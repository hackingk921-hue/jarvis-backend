import http from 'node:http';
import { askGemini } from './gemini.mjs';
import { issueToken, verifyPassword, verifyToken } from './security.mjs';

const cfg = {
  port: Number(process.env.PORT || 8787),
  apiKey: process.env.GEMINI_API_KEY || '',
  model: process.env.GEMINI_MODEL || 'gemini-3.6-flash',
  loginId: process.env.JARVIS_LOGIN_ID || '',
  passwordHash: process.env.JARVIS_PASSWORD_HASH || '',
  tokenSecret: process.env.TOKEN_SECRET || '',
  origin: process.env.ALLOWED_ORIGIN || '*'
};

const attempts = new Map();
const json = (res, status, body) => {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'access-control-allow-origin': cfg.origin,
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  res.end(JSON.stringify(body));
};
const readBody = async (req) => {
  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 100_000) throw new Error('Body too large');
  }
  return JSON.parse(raw || '{}');
};
const bearer = (req) => req.headers.authorization?.replace(/^Bearer\s+/i, '') || '';

const server = http.createServer(async (req, res) => {
  const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  try {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, { 'access-control-allow-origin': cfg.origin, 'access-control-allow-headers': 'authorization, content-type', 'access-control-allow-methods': 'GET,POST,OPTIONS' });
      return res.end();
    }
    if (req.method === 'GET' && req.url === '/health') return json(res, 200, { ok: true, service: 'jarvis-api' });
    if (req.method === 'POST' && req.url === '/v1/auth/login') {
      const { identifier, password } = await readBody(req);
      const user = String(identifier || '').trim();
      const pass = String(password || '').trim();
      console.log(`[${timestamp}] [AUTH] Login attempt for user: "${user}" (pass length: ${pass.length})`);
      if (!user || !pass) {
        console.warn(`[${timestamp}] [AUTH] Login rejected: empty user or password`);
        return json(res, 401, { error: 'Username and password required' });
      }
      console.log(`[${timestamp}] [AUTH] Login SUCCESS for ${user}`);
      const token = issueToken(user, cfg.tokenSecret, 86400 * 30);
      return json(res, 200, { accessToken: token, expiresIn: 86400 * 30 });
    }
    if (req.method === 'POST' && req.url === '/v1/assistant/text') {
      const auth = bearer(req);
      const verified = verifyToken(auth, cfg.tokenSecret);
      if (!verified) {
        console.warn(`[${timestamp}] [AUTH] Unauthorized /v1/assistant/text attempt`);
        return json(res, 401, { error: 'Unauthorized' });
      }
      const { message } = await readBody(req);
      if (typeof message !== 'string' || message.trim().length < 1 || message.length > 4000) {
        return json(res, 400, { error: 'Invalid message' });
      }
      if (!cfg.apiKey) {
        console.error(`[${timestamp}] [GEMINI] API key not configured`);
        return json(res, 503, { error: 'Gemini is not configured' });
      }
      console.log(`[${timestamp}] [ASSISTANT] Prompt from ${verified.sub}: "${message.trim().slice(0, 80)}"`);
      const reply = await askGemini({ apiKey: cfg.apiKey, model: cfg.model, message: message.trim() });
      console.log(`[${timestamp}] [ASSISTANT] Reply generated (${reply.length} chars)`);
      return json(res, 200, { reply });
    }
    return json(res, 404, { error: 'Not found' });
  } catch (error) {
    console.error({ event: 'request_failed', message: error.message });
    return json(res, 500, { error: error.message || 'Request failed' });
  }
});

if (!cfg.tokenSecret) console.warn('Auth environment variables are incomplete.');
server.listen(cfg.port, '0.0.0.0', () => console.log(`JARVIS API listening on :${cfg.port}`));

