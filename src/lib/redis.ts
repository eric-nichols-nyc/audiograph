import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
    throw new Error('REDIS_URL is not defined');
}

const redis = new Redis(process.env.REDIS_URL);

export async function get<T>(key: string): Promise<T | null> {
    const value = await redis.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
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