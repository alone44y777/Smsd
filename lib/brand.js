export const BRAND = {
  brand: 'Empire Tech Zone',
  tag: 'Powered By Empire Tech Zone',
  owner: 'Sardar Daud Arain',
  version: '3.0.0',
};

export const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type, x-api-key',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-expose-headers': 'x-powered-by, x-owner, x-brand, x-request-id',
};

export const HEADERS = {
  ...CORS,
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store',
  'x-powered-by': BRAND.brand,
  'x-brand': BRAND.tag,
  'x-owner': BRAND.owner,
};

export const meta = () => ({ powered_by: BRAND.tag, owner: BRAND.owner, version: BRAND.version });

export function respond(body, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify({ ...body, meta: meta() }, null, 2), {
    status,
    headers: { ...HEADERS, ...extraHeaders },
  });
}

export const ok = (body, h) => respond(body, 200, h);
export const fail = (msg, status = 400, extra = {}) => respond({ error: msg, ...extra }, status);
export const preflight = () => new Response(null, { status: 204, headers: CORS });
