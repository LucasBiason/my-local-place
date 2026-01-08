# Redis Service

This service provides a local Redis instance for caching, sessions, and real-time data structures.

## When to Use

- **Caching** — Cache API responses, database queries, or computed results
- **Session storage** — Store user sessions for web applications
- **Rate limiting** — Implement rate limiting using Redis counters
- **Real-time features** — Pub/Sub for real-time messaging or notifications
- **Job queues** — Simple job queue using Redis lists (or integrate with Celery)

## Usage

```bash
# Start Redis only
docker compose up local-redis

# Start Redis with other services (e.g., PostgreSQL for full-stack development)
docker compose up local-redis local-postgres
```

## Connection Details

- **Host:** `localhost`
- **Port:** `6379` (default Redis port)
- **Password:** Optional (configure via `.env` if needed)

## Accessing Redis

### Command Line (Redis CLI)

```bash
docker compose exec local-redis redis-cli
```

### Application Connection

```python
# Python (redis-py)
import redis
r = redis.Redis(host='localhost', port=6379, db=0)
```

```typescript
// TypeScript/Node.js (ioredis)
import Redis from 'ioredis';
const redis = new Redis('redis://localhost:6379');
```

## Data Persistence

Redis can be configured for persistence:
- **RDB snapshots** — Periodic snapshots (default)
- **AOF (Append Only File)** — Log every write operation

**Note:** By default, data is stored in memory and may be lost on container restart. Enable persistence in `services/redis.yml` if needed.

## Configuration

Redis runs with default configuration optimized for development. Key settings:
- **Max memory:** Unbounded (use `maxmemory` policy if needed)
- **Eviction policy:** `noeviction` (don't evict keys)
- **Persistence:** RDB snapshots enabled

## Common Use Cases

### Caching

```python
import redis
r = redis.Redis(host='localhost', port=6379)

# Cache a value
r.set('user:123', '{"name": "John"}', ex=3600)  # Expires in 1 hour

# Get cached value
user = r.get('user:123')
```

### Pub/Sub

```python
# Publisher
r.publish('channel', 'message')

# Subscriber
pubsub = r.pubsub()
pubsub.subscribe('channel')
message = pubsub.get_message()
```

### Rate Limiting

```python
import time

def rate_limit(user_id, limit=100, window=3600):
    key = f'ratelimit:{user_id}'
    current = r.incr(key)
    if current == 1:
        r.expire(key, window)
    return current <= limit
```

## Health Check

Check if Redis is running:

```bash
docker compose exec local-redis redis-cli ping
# Should return: PONG
```

## Notes

- **In-memory storage** — Data is stored in RAM for fast access
- **No password by default** — Suitable for local development only
- **Single instance** — For production, consider Redis Cluster or Sentinel
- **Persistence** — Data may be lost on container restart unless configured

## Troubleshooting

### Redis is not accepting connections

```bash
# Check if container is running
docker compose ps local-redis

# Check logs
docker compose logs local-redis
```

### Out of memory

If Redis runs out of memory, configure eviction policy or increase container memory limits.

---

**This service is optimized for local development. For production, use a managed Redis service or Redis Cluster.**

