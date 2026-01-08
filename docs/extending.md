# Extending the Platform

This guide explains how to add new services or features to My Local Place.

## Adding a New Service

### Step 1: Create Service Definition

Create a new YAML file under `/services` (e.g., `services/rabbitmq.yml`):

```yaml
services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: local-rabbitmq
    ports:
      - "5672:5672"      # AMQP port
      - "15672:15672"    # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - local-services-network
    healthcheck:
      test: ["CMD", "rabbitmq-diagnostics", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    profiles:
      - services

volumes:
  rabbitmq_data:
```

### Step 2: Reference in Main Compose File

Add the service to `docker-compose.yml`:

```yaml
services:
  local-rabbitmq:
    container_name: local-rabbitmq
    extends:
      file: services/rabbitmq.yml
      service: rabbitmq
    env_file:
      - .env
    networks:
      - local-services-network
    profiles:
      - services
```

### Step 3: Add Documentation

Create a README for the service (e.g., `services/rabbitmq/README.md`):

```markdown
# RabbitMQ Service

## When to Use
- Message queue for microservices
- Async task processing
- Event-driven architectures

## Usage
docker compose up local-rabbitmq

## Connection Details
- Host: localhost
- Port: 5672 (AMQP)
- Management UI: http://localhost:15672
```

### Step 4: Update Main README

Add the service to the "Available Services" section in the main README.

## Adding Backend Features

### New Endpoint

1. **Create Schema** (`backend/app/schemas/new_feature.py`):
```python
from pydantic import BaseModel

class NewFeatureRequest(BaseModel):
    field: str
```

2. **Create Controller** (`backend/app/controllers/new_feature_controller.py`):
```python
from app.repositories.docker_repository import DockerRepository

class NewFeatureController:
    def __init__(self):
        self.docker_repo = DockerRepository()
    
    async def do_something(self, request: NewFeatureRequest):
        # Business logic here
        pass
```

3. **Create Router** (`backend/app/routers/new_feature.py`):
```python
from fastapi import APIRouter
from app.controllers.new_feature_controller import NewFeatureController

router = APIRouter(prefix="/api/v1/new-feature", tags=["new-feature"])
controller = NewFeatureController()

@router.post("/")
async def endpoint(request: NewFeatureRequest):
    return await controller.do_something(request)
```

4. **Register Router** (`backend/app/main.py`):
```python
from app.routers import new_feature

app.include_router(new_feature.router)
```

### Add Tests

Create tests in `backend/tests/` following the existing pattern:

```python
import pytest
from app.controllers.new_feature_controller import NewFeatureController

def test_new_feature():
    controller = NewFeatureController()
    # Test logic here
    pass
```

## Adding Frontend Features

### New Component

1. **Create Component** (`frontend/src/components/NewFeature.tsx`):
```typescript
import { memo } from 'react'

type NewFeatureProps = {
  data: string
}

export const NewFeature = memo(({ data }: NewFeatureProps) => {
  return (
    <div className="bg-[#1a1a1a] rounded-lg p-4">
      <p>{data}</p>
    </div>
  )
})

NewFeature.displayName = 'NewFeature'
```

2. **Use in App** (`frontend/src/App.tsx`):
```typescript
import { NewFeature } from '@/components/NewFeature'

// Use in your component tree
<NewFeature data="example" />
```

### New Hook

Create a custom hook (`frontend/src/hooks/useNewFeature.ts`):

```typescript
import { useState, useEffect } from 'react'
import { api } from '@/services/api'

export const useNewFeature = () => {
  const [data, setData] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/api/v1/new-feature')
        setData(response.data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, loading }
}
```

## Best Practices

### Service Definition

- **Use official images** — Prefer official Docker images from Docker Hub
- **Set health checks** — Help Docker know when services are ready
- **Use profiles** — Make services optional with profiles
- **Document ports** — Clearly document which ports are exposed

### Code Organization

- **Follow existing patterns** — Match the structure of existing code
- **Add tests** — Maintain test coverage above 90%
- **Type safety** — Use type hints in Python and TypeScript
- **Documentation** — Document complex logic and decisions

### Naming Conventions

- **Services:** `local-{service-name}` (e.g., `local-postgres`)
- **Containers:** Match service names for consistency
- **Volumes:** `local_{service_name}_data` (e.g., `local_postgres_data`)
- **Components:** PascalCase (e.g., `ContainerCard.tsx`)
- **Hooks:** camelCase with `use` prefix (e.g., `useContainers.ts`)

## Testing Extensions

After adding new features:

```bash
# Run all tests
make test

# Run specific test file
docker compose run --rm test pytest backend/tests/path/to/test_file.py

# Check coverage
docker compose run --rm test pytest --cov=app --cov-report=html
```

## Versioning Considerations

When adding new services or features:

1. **Update CHANGELOG.md** — Document the change
2. **Update version** — Bump version if it's a significant change
3. **Update documentation** — Keep README and docs up to date
4. **Test thoroughly** — Ensure new features don't break existing functionality

---

**Remember: Keep the platform simple and focused. Not every feature needs to be added.**

