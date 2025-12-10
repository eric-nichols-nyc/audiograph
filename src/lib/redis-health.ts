import { getRedis } from './redis';

let lastHealthCheck: { isHealthy: boolean; timestamp: number; error?: string } = {
  isHealthy: true,
  timestamp: 0,
};

const HEALTH_CHECK_INTERVAL = 60000; // Check every 60 seconds

/**
 * Check if Redis is healthy (cached for 60 seconds)
 */
export async function checkRedisHealth(): Promise<{ isHealthy: boolean; error?: string }> {
  const now = Date.now();

  // Return cached result if checked recently
  if (now - lastHealthCheck.timestamp < HEALTH_CHECK_INTERVAL) {
    return { isHealthy: lastHealthCheck.isHealthy, error: lastHealthCheck.error };
  }

  try {
    const redis = getRedis();
    await redis.ping();
    lastHealthCheck = { isHealthy: true, timestamp: now };

    // Clear any previous errors
    if (lastHealthCheck.error) {
      console.log('✅ Redis connection restored');
    }

    return { isHealthy: true };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error';

    // Only log if this is a new error (not repeatedly)
    if (lastHealthCheck.isHealthy) {
      console.error('');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('⚠️  REDIS CONNECTION FAILED');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('Error:', errorMsg);
      console.error('');
      console.error('Your app will continue to work, but without caching.');
      console.error('This may result in slower response times.');
      console.error('');
      console.error('To fix:');
      console.error('1. Check your Vercel KV dashboard');
      console.error('2. Verify KV_REST_API_URL and KV_REST_API_TOKEN in .env.local');
      console.error('3. Run: curl -H "Authorization: Bearer $KV_REST_API_TOKEN" $KV_REST_API_URL/ping');
      console.error('');
      console.error('Health check: http://localhost:3000/api/health');
      console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.error('');
    }

    lastHealthCheck = { isHealthy: false, timestamp: now, error: errorMsg };
    return { isHealthy: false, error: errorMsg };
  }
}

/**
 * Run an initial health check on startup
 */
export async function runStartupHealthCheck(): Promise<void> {
  console.log('🔍 Running Redis health check...');
  const result = await checkRedisHealth();

  if (result.isHealthy) {
    console.log('✅ Redis connected successfully');
  }
  // Error will be logged by checkRedisHealth if it fails
}
