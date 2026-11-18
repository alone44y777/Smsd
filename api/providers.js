import { PROVIDERS } from '../lib/providers.js';
import { ok, preflight } from '../lib/brand.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') return preflight();
  return ok({
    total: PROVIDERS.length,
    core: PROVIDERS.filter((p) => p.tier === 'core').length,
    extra: PROVIDERS.filter((p) => p.tier === 'extra').length,
    providers: PROVIDERS.map((p) => ({
      id: p.id, name: p.name, category: p.category,
      tier: p.tier, cooldown_seconds: p.cooldown,
      env_required: !!p.available,
    })),
  });
}
