# Monitoring and Troubleshooting

## Health Checks

### Health Check Endpoint

Check the status of all services:

```bash
curl http://localhost:3000/api/health | jq
```

**Response:**

```json
{
  "status": "healthy", // or "degraded"
  "timestamp": "2025-12-10T00:04:10.153Z",
  "services": {
    "database": {
      "status": "healthy",
      "message": "Connected"
    },
    "redis": {
      "status": "healthy",
      "message": "Connected"
    }
  }
}
```

### Quick Health Check Scripts

Add to `package.json`:

```json
"scripts": {
  "health": "curl http://localhost:3000/api/health | jq",
  "health:redis": "curl http://localhost:3000/api/health | jq '.services.redis'",
  "health:db": "curl http://localhost:3000/api/health | jq '.services.database'"
}
```

Then run: `pnpm health`

## Common Issues

### Redis Connection Failed

**Symptoms:**

- Slow page loads
- Console warning: `❌ Redis GET failed for key:`
- Health check shows Redis as "unhealthy"
- Large warning box in terminal on startup

**Visual Terminal Warning:**

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️  REDIS CONNECTION FAILED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Your app will continue to work, but without caching.
...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Causes:**

1. Vercel KV instance was deleted or paused
2. Invalid or expired credentials
3. Network connectivity issues

**Solution:**

1. **Check if Redis instance exists:**

   ```bash
   # Via Vercel Dashboard
   # Go to: Your Project → Storage → KV

   # Via CLI
   vercel kv list
   ```

2. **Test connection manually:**

   ```bash
   curl -H "Authorization: Bearer $KV_REST_API_TOKEN" \
        "$KV_REST_API_URL/ping"
   ```

3. **Create new KV instance if needed:**

   ```bash
   vercel kv create
   ```

4. **Update environment variables:**
   - Copy new `KV_REST_API_URL` and `KV_REST_API_TOKEN`
   - Update `.env.local`
   - Restart dev server

### GraphQL Returns No Data

**Symptoms:**

- Components show loading state indefinitely
- Console: `GraphQL response: undefined`
- Page shows loaders but no content

**Common Causes:**

1. **Redis failure** (see above) - App now handles this gracefully
2. Database connection issues
3. Missing artist data in database

**Debugging Steps:**

1. Check health endpoint:

   ```bash
   pnpm health
   ```

2. Test GraphQL directly:

   ```bash
   curl -X POST http://localhost:3000/api/graphql \
     -H "Content-Type: application/json" \
     -d '{"query":"query { artist(id: \"YOUR_ARTIST_ID\") { id name } }"}'
   ```

3. Check terminal for errors:
   - Look for `❌ Redis GET failed`
   - Look for database errors
   - Check GraphQL resolver warnings

## Caching Strategy

The app uses Redis for caching with graceful degradation:

| Data Type       | Cache Duration | Fallback |
| --------------- | -------------- | -------- |
| Artist Details  | 1 hour         | Database |
| Metrics         | 5 minutes      | Database |
| Tracks          | 30 minutes     | Database |
| Videos          | 30 minutes     | Database |
| Similar Artists | 1 hour         | Database |

**How it works:**

1. Try to get data from Redis cache
2. If Redis fails, catch error and log warning
3. Fetch directly from database
4. Try to cache result (fails silently if Redis down)
5. Return data to client

**Impact of Redis being down:**

- ✅ App continues to work
- ❌ Slower response times
- ❌ Higher database load
- ❌ No request deduplication

## Error Handling

### Graceful Degradation

All Redis operations are wrapped in try-catch blocks:

```typescript
try {
  const cachedData = await getCachedData(key);
  if (cachedData) return cachedData;
} catch (error) {
  console.warn("Redis cache read failed, falling back to database:", error);
}

// Fetch from database...

try {
  await setCachedData(key, data, ttl);
} catch (error) {
  console.warn("Redis cache write failed, continuing without cache:", error);
}
```

This ensures:

- No GraphQL query failures due to Redis
- Users always get data
- Clear warnings in logs

### Error Messages

The app logs different types of errors:

| Prefix | Severity | Meaning                                 |
| ------ | -------- | --------------------------------------- |
| `❌`   | Error    | Operation failed, requires attention    |
| `⚠️`   | Warning  | Degraded functionality, app still works |
| `✅`   | Success  | Service healthy or restored             |

## Monitoring Best Practices

1. **Check health on deploy:**

   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Monitor in production:**

   - Set up Vercel monitoring alerts
   - Use uptime monitoring (e.g., UptimeRobot)
   - Check health endpoint periodically

3. **Local development:**

   - Run `pnpm health` before starting work
   - Check terminal for warning boxes
   - Monitor console for Redis errors

4. **After Vercel KV changes:**
   - Always run health check
   - Test GraphQL queries
   - Verify caching is working

## Troubleshooting Checklist

When debugging issues:

- [ ] Run `pnpm health` to check all services
- [ ] Check terminal for Redis warning boxes
- [ ] Look for `❌` errors in console
- [ ] Test GraphQL endpoint directly
- [ ] Verify environment variables are set
- [ ] Check Vercel KV dashboard for instance status
- [ ] Restart dev server after env changes

## Related Documentation

- [Caching Strategies](./caching-strategies.md)
- [GraphQL Migration](./graphql-migration.md)
- [README](../README.md)
