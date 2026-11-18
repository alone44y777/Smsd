import { ok, preflight, BRAND } from '../lib/brand.js';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') return preflight();
  return ok({
    service: 'Empire SMS OTP API',
    status: 'online',
    brand: BRAND.brand,
    endpoints: {
      bomb: 'GET /api/bomb?phone=03XXXXXXXXX&key=API_KEY',
      health: 'GET /api/health?phone=03XXXXXXXXX',
      providers: 'GET /api/providers',
    },
    params: {
      phone: 'required',
      count: 'optional 1-26, default 20',
      tier: 'core | extra | all, default core',
      stagger: 'optional 60-400ms, default 140 (kam = tez)',
      only: 'optional comma list',
      skip: 'optional comma list',
    },
  });
}
