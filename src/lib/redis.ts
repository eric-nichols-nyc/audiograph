import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL) {
    throw new Error('UPSTASH_REDIS_REST_URL is not defined');
}

if (!process.env.UPSTASH_REDIS_REST_TOKEN) {
    throw new Error('UPSTASH_REDIS_REST_TOKEN is not defined');
}

const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

export async function get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    return value as T;
}

export async function set<T>(key: string, value: T, ttl?: number): Promise<void> {
    if (ttl) {
        await redis.setex(key, ttl, JSON.stringify(value));
    } else {
        await redis.set(key, JSON.stringify(value));
    }
}

export async function del(key: string): Promise<void> {
    await redis.del(key);
}

export async function invalidateByPattern(pattern: string): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
}

export default redis; 