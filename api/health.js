import { PROVIDERS } from '../lib/providers.js';
import { normalize } from '../lib/phone.js';
import { hit } from '../lib/engine.js';
import { ok, fail, preflight } from '../lib/brand.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') return preflight();

  const url = new URL(req.url);
  const phone = normalize(url.searchParams.get('phone') || process.env.TEST_PHONE || '');
  if (!phone) return fail('phone param ya TEST_PHONE env chahiye', 400);

  const only = url.searchParams.get('only');
  const tier = url.searchParams.get('tier');
  let list = PROVIDERS;
  if (only) list = PROVIDERS.filter((p) => only.split(',').includes(p.id));
  else if (tier && tier !== 'all') list = PROVIDERS.filter((p) => p.tier === tier);

  const detail = await Promise.all(list.map((p) => hit(p, phone)));
  const alive = detail.filter((d) => ['sent', 'limited'].includes(d.result)).length;

  return ok({ phone: phone.e164, total: list.length, alive, dead: list.length - alive, detail });
           }
