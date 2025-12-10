import { NextResponse } from 'next/server';
import { runStartupHealthCheck } from '@/lib/redis-health';

// This endpoint can be called when the dev server starts
// to check Redis connectivity
export async function GET() {
  await runStartupHealthCheck();
  return NextResponse.json({ message: 'Health check complete' });
}
