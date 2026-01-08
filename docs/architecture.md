# Architecture Overview

## High-Level Architecture

The platform follows a **modular architecture** where each service can be used independently or composed together depending on the development needs.

There is no central dependency between services. This allows developers to spin up only what is required for each project, reducing resource usage and startup time.

## Component Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Developer Machine                     │
│                                                          │
│  ┌─────────────────┐         ┌──────────────────┐      │
│  │ React Frontend  │────────▶│ FastAPI Backend  │      │
│  │  (Dashboard)    │  HTTP   │  (Orchestrator)  │      │
│  │  Port: 3000     │◀────────│   Port: 8800     │      │
│  └─────────────────┘         └────────┬─────────┘      │
│                                       │                 │
│                          Docker Socket API              │
│                                       │                 │
│                    ┌──────────────────┴──────────┐     │
│                    │                              │     │
│        ┌───────────▼──────────┐    ┌─────────────▼──┐  │
│        │   PostgreSQL         │    │     Redis      │  │
│        │   Port: 5432         │    │   Port: 6379   │  │
│        └──────────────────────┘    └────────────────┘  │
│                                                          │
│        ┌───────────┐    ┌───────────┐    ┌──────────┐ │
│        │   Kafka   │    │  RabbitMQ │    │  Ollama  │ │
│        │  :9092    │    │   :5672   │    │  :11434  │ │
│        └───────────┘    └───────────┘    └──────────┘ │
│                                                          │
│                    ... (more services)                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Service Isolation

Each service is defined in its own Docker Compose file under `/services`, using the `extends` pattern in the main `docker-compose.yml`.

### Benefits

- **Independent lifecycle** — Start/stop services individually
- **Service-specific configuration** — Each service has its own env vars and volumes
- **Easy extension** — Add new services without modifying existing ones
- **Resource efficiency** — Only run what you need

## Backend Architecture

### FastAPI Application Structure

```
backend/
├── app/
│   ├── main.py              # Application entry point
│   ├── controllers/         # Business logic
│   │   ├── container_controller.py
│   │   ├── system_controller.py
│   │   └── alert_controller.py
│   ├── routers/            # API routes
│   │   ├── containers.py
│   │   ├── system.py
│   │   └── volumes.py
│   ├── repositories/       # Data access layer
│   │   ├── docker_repository.py
│   │   └── volume_repository.py
│   ├── schemas/            # Pydantic models
│   │   ├── container.py
│   │   └── system.py
│   └── core/               # Core infrastructure
│       └── docker_client.py
└── tests/                  # Test suite
```

### Design Patterns

- **Repository Pattern** — Abstracts Docker SDK interactions
- **Controller Pattern** — Separates business logic from routing
- **Schema Validation** — Pydantic models for request/response validation
- **Dependency Injection** — FastAPI's dependency system for testability

## Frontend Architecture

### React Application Structure

```
frontend/
├── src/
│   ├── App.tsx             # Main application component
│   ├── components/         # React components
│   │   ├── ContainerCard.tsx
│   │   ├── MetricsChart.tsx
│   │   └── LogViewer.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useContainers.ts
│   │   ├── useContainerStats.ts
│   │   └── useSystemMetrics.ts
│   ├── services/           # API client
│   │   └── api.ts
│   └── types/              # TypeScript types
│       └── index.ts
```

### Design Principles

- **Functional components** — Modern React with hooks
- **Custom hooks** — Encapsulate data fetching and state management
- **Type safety** — Full TypeScript coverage
- **Component composition** — Reusable, composable components

## Data Flow

### Container Lifecycle

```
User Action (Frontend)
    ↓
HTTP Request → FastAPI Router
    ↓
Controller (Business Logic)
    ↓
Repository (Docker SDK)
    ↓
Docker Daemon
    ↓
Container State Change
    ↓
WebSocket / Polling Update
    ↓
Frontend UI Update
```

### Resource Monitoring

```
Docker Stats API (Continuous)
    ↓
Backend Aggregation
    ↓
WebSocket Broadcast
    ↓
Frontend Chart Update (Recharts)
```

## Network Architecture

All services run on a shared Docker network (`local-services-network`), enabling:

- **Service discovery** — Services can communicate by container name
- **Isolation** — Services are isolated from host network
- **Port management** — Ports are exposed to host only when needed

## Volume Management

Persistent data is stored in Docker volumes:

- **Database data** — PostgreSQL, MongoDB, MySQL
- **Message broker data** — Kafka, RabbitMQ
- **Application data** — n8n workflows, Jupyter notebooks

Volumes are managed independently per service and can be cleaned up when needed.

## Security Considerations

- **Docker socket access** — Backend runs with read-only Docker socket access
- **No authentication** — Platform is designed for local use only
- **Port exposure** — Only necessary ports are exposed to host
- **Network isolation** — Services communicate only through Docker network

**Note:** This platform is **not intended for production use**. It's optimized for local development environments.

## Performance Considerations

- **Lazy loading** — Services are created but not started by default
- **Resource limits** — Services can have resource limits configured
- **Health checks** — Services include health checks for reliability
- **Restart policies** — Services use `unless-stopped` for resilience

## Extensibility

The platform is designed to be easily extensible:

1. **New services** — Add a new YAML file under `/services`
2. **New features** — Add controllers and routers in backend
3. **New UI components** — Add React components in frontend
4. **New integrations** — Extend Docker repository for new capabilities

---

**This architecture prioritizes simplicity, modularity and developer experience over complexity.**

