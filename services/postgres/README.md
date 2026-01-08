# PostgreSQL Service

This service provides a local PostgreSQL instance optimized for development.

## When to Use

- **Local backend development** — SQL database for Django, FastAPI, or other Python frameworks
- **Testing database migrations** — Verify migrations work correctly before production
- **Data exploration** — Query and analyze datasets locally
- **Development prototyping** — Quick database setup for new projects

## Usage

```bash
# Start PostgreSQL only
docker compose up local-postgres

# Start PostgreSQL with pgAdmin (database management UI)
docker compose up local-postgres local-dbadmin
```

## Connection Details

- **Host:** `localhost`
- **Port:** `5432` (default PostgreSQL port)
- **User:** `postgres` (configurable via `.env`)
- **Password:** Set in `.env` file
- **Database:** `postgres` (default, create your own as needed)

## Accessing the Database

### Command Line

```bash
docker compose exec local-postgres psql -U postgres -d postgres
```

### pgAdmin (Web UI)

If `local-dbadmin` is running, access pgAdmin at:
- **URL:** http://localhost:5050
- **Email:** Set in `.env` (default: `admin@admin.com`)
- **Password:** Set in `.env` (default: `admin`)

### Application Connection String

```python
# Python (psycopg2 or SQLAlchemy)
DATABASE_URL = "postgresql://postgres:your_password@localhost:5432/your_database"
```

```typescript
// TypeScript/Node.js (pg or Prisma)
DATABASE_URL = "postgresql://postgres:your_password@localhost:5432/your_database"
```

## Data Persistence

Data is persisted using Docker volumes:
- **Volume name:** `local_postgres_data`
- **Location:** Managed by Docker (typically `/var/lib/docker/volumes/`)

Data persists across container restarts. To reset:
```bash
docker compose down -v  # WARNING: This deletes all data
```

## Configuration

Create or edit `.env` file:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=postgres
```

## Health Check

The service includes a health check that verifies PostgreSQL is ready:

```bash
docker compose ps local-postgres
```

Status should show `healthy` when ready.

## Notes

- **Default credentials are for local use only** — Never use default passwords in production
- **Data persists in volumes** — Your databases survive container restarts
- **Multiple databases** — You can create multiple databases in the same PostgreSQL instance
- **Extensions** — Common PostgreSQL extensions are available (e.g., `uuid-ossp`, `pg_trgm`)

## Common Tasks

### Create a New Database

```bash
docker compose exec local-postgres psql -U postgres -c "CREATE DATABASE my_app;"
```

### Backup a Database

```bash
docker compose exec local-postgres pg_dump -U postgres my_app > backup.sql
```

### Restore a Database

```bash
docker compose exec -T local-postgres psql -U postgres my_app < backup.sql
```

---

**This service is optimized for local development. For production, use a managed PostgreSQL service.**

