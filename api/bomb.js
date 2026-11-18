import { normalize } from '../lib/phone.js';
import { runBomb } from '../lib/engine.js';
import * as store from '../lib/store.js';
import { ok, fail, preflight, respond } from '../lib/brand.js';

// Edge runtime wapis laga diya
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') return preflight();

  const url = new URL(req.url);
  // node:crypto ki jagah web crypto use kiya
  const rid = crypto.randomUUID().slice(0, 8);
  const h = { 'x-request-id': rid };

  const key = process.env.API_KEY;
  if (!key) return fail('server: API_KEY env set nahi hai', 500, { request_id: rid });

  const given = req.headers.get('x-api-key') || url.searchParams.get('key') || '';
  if (given !== key) return fail('invalid api key', 401, { request_id: rid });

  const allowed = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
  const origin = req.headers.get('origin');
  if (allowed.length && origin && !allowed.includes(origin)) {
    return fail('origin not allowed', 403, { request_id: rid });
  }

  let phoneRaw, count, stagger, tier, only, skip;
  if (req.method === 'POST') {
    let b = {};
    try { b = await req.json(); } catch { return fail('invalid json body', 400, { request_id: rid }); }
    ({ phone: phoneRaw, count, stagger, tier, only, skip } = b);
  } else {
    const q = url.searchParams;
    phoneRaw = q.get('phone'); count = q.get('count'); stagger = q.get('stagger');
    tier = q.get('tier'); only = q.get('only'); skip = q.get('skip');
  }

  const phone = normalize(phoneRaw);
  if (!phone) return fail('bad number. 03XXXXXXXXX ya +923XXXXXXXXX de', 400, { request_id: rid });

  const limit = Number(process.env.IP_LIMIT || 40);
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anon';
  const used = await store.incr(`ip:${ip}`, 3600);
  if (used > limit) return fail('ip rate limit reached', 429, { limit, used, reset_in: '1 hour', request_id: rid });

  const lockKey = `lock:${phone.msisdn}`;
  if (!(await store.lock(lockKey, 90))) {
    return fail('is number pe pehle se bomb chal raha hai', 409, { phone: phone.e164, request_id: rid });
  }

  try {
    const report = await runBomb(phone, { count, stagger, tier, only, skip });
    report.request_id = rid;
    report.ip_used = `${used}/${limit}`;
    return ok(report, h);
  } catch (e) {
    return respond({ error: 'bomb failed', detail: e.message, request_id: rid }, 500);
  } finally {
    await store.unlock(lockKey);
  }
}
