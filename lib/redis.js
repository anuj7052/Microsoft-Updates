import { Redis } from '@upstash/redis'

let redisInstance = null

function getRedis() {
  if (!redisInstance) {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      return null // Redis not configured — degrade gracefully
    }
    redisInstance = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  }
  return redisInstance
}

export const CACHE_TTL = {
  UPDATES_LIST: 900,   // 15 minutes
  SINGLE_UPDATE: 3600, // 1 hour
  TRENDING: 1800,      // 30 minutes
  CATEGORY: 900,       // 15 minutes
}

// Safe wrappers — never throw so app works even without Redis
export async function cacheGet(key) {
  try {
    const r = getRedis()
    if (!r) return null
    return await r.get(key)
  } catch {
    return null
  }
}

export async function cacheSet(key, value, ttl = 900) {
  try {
    const r = getRedis()
    if (!r) return
    await r.set(key, value, { ex: ttl })
  } catch {}
}

export async function cacheDel(...keys) {
  try {
    const r = getRedis()
    if (!r) return
    await Promise.all(keys.map((k) => r.del(k)))
  } catch {}
}
