import { Redis } from '@upstash/redis';

const mem = (globalThis.__empireStore ||= new Map());
const useRedis = !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
const redis = useRedis ? Redis.fromEnv() : null;

export const persistent = useRedis;

export async function get(k) {
  if (redis) return redis.get(k);
  const v = mem.get(k);
  if (!v) return null;
  if (v.exp && Date.now() > v.exp) { mem.delete(k); return null; }
  return v.val;
}

export async function set(k, v, ex) {
  if (redis) return redis.set(k, v, { ex });
  mem.set(k, { val: v, exp: Date.now() + ex * 1000 });
}

export async function incr(k, ex) {
  if (redis) {
    const n = await redis.incr(k);
    if (n === 1) await redis.expire(k, ex);
    return n;
  }
  const n = Number((await get(k)) || 0) + 1;
  await set(k, n, ex);
  return n;
}

export async function lock(k, ex) {
  if (redis) return (await redis.set(k, '1', { nx: true, ex })) === 'OK';
  if (await get(k)) return false;
  await set(k, 1, ex);
  return true;
}

export async function unlock(k) {
  if (redis) return redis.del(k);
  mem.delete(k);
}
