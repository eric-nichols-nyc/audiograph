# Documentation

## Table of Contents

### Getting Started

- [Main README](../README.md) - Project overview, setup, and architecture

### Operations & Troubleshooting

- **[Monitoring and Troubleshooting](./monitoring-and-troubleshooting.md)** ⭐ NEW
  - Health checks and service monitoring
  - Common issues and solutions (Redis, GraphQL, etc.)
  - Error handling and graceful degradation
  - Debugging checklist

### Architecture & Development

- [GraphQL Migration](./graphql-migration.md) - GraphQL implementation details
- [GraphQL Overview](./graphql.md) - GraphQL architecture and usage
- [Caching Strategies](./caching-strategies.md) - Redis caching implementation
- [Tracking Strategy](./tracking-strategy.md) - Analytics and tracking

### Features

- [Most Viewed Videos Comparison](./features/most-viewed-videos-comparison.md)
- [Compare Page GraphQL Migration](./compare-page-graphql-migration.md)
- [Track GraphQL Migration](./track-graphql-migration.md)

### Migrations

- [Migration Guides](./migrations/) - Database and feature migrations

## Quick Reference

### Health Checks

```bash
# Check all services
curl http://localhost:3000/api/health | jq

# Check Redis only
curl http://localhost:3000/api/health | jq '.services.redis'

# Check database only
curl http://localhost:3000/api/health | jq '.services.database'
```

### Common Commands

```bash
# Start development server
pnpm dev

# Run health check
pnpm health  # (add to package.json)

# Clear Redis cache
pnpm cache:clear  # (if implemented)
```

### Important URLs

- **Health Check**: `http://localhost:3000/api/health`
- **GraphQL Playground**: `http://localhost:3000/api/graphql`
- **Main App**: `http://localhost:3000`

## Recent Updates

### December 2025

- ✅ Added Redis health monitoring
- ✅ Implemented graceful degradation for Redis failures
- ✅ Added health check endpoint (`/api/health`)
- ✅ Improved error logging and terminal warnings
- ✅ Fixed GraphQL queries to handle Redis downtime

### Key Changes

- **Redis is now optional**: App works without Redis (just slower)
- **Better error messages**: Clear warnings when services are down
- **Health monitoring**: Easy way to check service status
