import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getRedis } from '@/lib/redis';

export async function GET() {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: { status: 'unknown', message: '' },
      redis: { status: 'unknown', message: '' },
    },
  };

  // Check Supabase connection
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('artists').select('id').limit(1);

    if (error) {
      health.services.database.status = 'unhealthy';
      health.services.database.message = error.message;
      health.status = 'degraded';
    } else {
      health.services.database.status = 'healthy';
      health.services.database.message = 'Connected';
    }
  } catch (error) {
    health.services.database.status = 'unhealthy';
    health.services.database.message = error instanceof Error ? error.message : 'Unknown error';
    health.status = 'degraded';
  }

  // Check Redis connection
  try {
    const redis = getRedis();
    await redis.ping();
    health.services.redis.status = 'healthy';
    health.services.redis.message = 'Connected';
  } catch (error) {
    health.services.redis.status = 'unhealthy';
    health.services.redis.message = error instanceof Error ? error.message : 'Redis unavailable';
    health.status = 'degraded';
    console.warn('⚠️  REDIS HEALTH CHECK FAILED:', error);
  }

  return NextResponse.json(health, {
    status: health.status === 'healthy' ? 200 : 503,
  });
}
