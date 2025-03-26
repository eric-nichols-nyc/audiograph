import Redis from 'ioredis';

// Cache TTL in seconds
export const CACHE_TTL = {
    ARTIST: 3600, // 1 hour
    METRICS: 300, // 5 minutes
    TRACKS: 1800, // 30 minutes
    VIDEOS: 1800, // 30 minutes
} as const;

let redisClient: Redis | null = null;

// Initialize Redis client
const getRedisClient = () => {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
        throw new Error('Redis configuration is missing. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN');
    }

    // Extract host from REST URL
    const host = process.env.UPSTASH_REDIS_REST_URL.replace('https://', '');

    return new Redis({
        host,
        port: 6379, // Default Redis port
        password: process.env.UPSTASH_REDIS_REST_TOKEN,
        tls: {
            rejectUnauthorized: false
        }
    });
};

export const getRedis = () => {
    if (!redisClient) {
        redisClient = getRedisClient();
    }
    return redisClient;
};

// Helper function to get cached data
export async function getCachedData<T>(key: string): Promise<T | null> {
    const client = getRedis();
    const data = await client.get(key);
    return data ? JSON.parse(data) : null;
}

// Helper function to set cached data
export async function setCachedData<T>(key: string, data: T, ttl: number): Promise<void> {
    const client = getRedis();
    await client.setex(key, ttl, JSON.stringify(data));
}

// Helper to generate cache keys
export const getCacheKey = {
    artist: (id: string) => `artist:${id}:details`,
    metrics: (id: string) => `artist:${id}:metrics`,
    tracks: (id: string) => `artist:${id}:tracks`,
    videos: (id: string) => `artist:${id}:videos`,
} as const;

export async function get<T>(key: string): Promise<T | null> {
    const client = getRedis();
    const value = await client.get(key);
    if (!value) return null;
    return JSON.parse(value) as T;
}

export async function set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const client = getRedis();
    if (ttl) {
        await client.setex(key, ttl, JSON.stringify(value));
    } else {
        await client.set(key, JSON.stringify(value));
    }
}

export async function del(key: string): Promise<void> {
    const client = getRedis();
    await client.del(key);
}

export async function invalidateByPattern(pattern: string): Promise<void> {
    const client = getRedis();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
        await client.del(...keys);
    }
}

// Export functions directly instead of a default export
export const redis = {
    get,
    set,
    del,
    invalidateByPattern,
    getCachedData,
    setCachedData,
    getCacheKey
};