# MyLocalPlace v2.0 - Dashboard DevTools

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)
[![Python](https://img.shields.io/badge/Python-3.13-blue.svg)](https://python.org)
[![Tests](https://img.shields.io/badge/Tests-69%20passed-success.svg)](https://pytest.org)
[![Coverage](https://img.shields.io/badge/Coverage-92.28%25-success.svg)](https://coverage.readthedocs.io)

> **Dashboard API for managing local Docker containers and development services**

FastAPI application for managing Docker containers locally. Provides REST API to start, stop, restart, view logs and monitor resource usage of containers.

## Features

- REST API for Docker container management
- Real-time container statistics (CPU, RAM, Network)
- Container logs with timestamp
- System resource monitoring
- Unified Docker environment
- 9 pre-configured services

## Tech Stack

- **Backend**: FastAPI 0.115
- **Docker SDK**: 7.1
- **Python**: 3.13
- **Validation**: Pydantic 2.10
- **Server**: Uvicorn 0.32
- **Testing**: pytest + coverage (92.28%)

## Quick Start

### Prerequisites

- Docker 24+
- Docker Compose 2+
- Make

### Installation

```bash
git clone https://github.com/LucasBiason/my-local-place.git
cd my-local-place
```

### Run

```bash
# Start API + create all services (not started)
make up

# Run tests
make test

# Stop all
make down
```

### Access

- **API**: http://localhost:8000
- **Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## API Endpoints

### Health
- `GET /health` - Health check

### Containers
- `GET /api/v1/containers` - List all containers
- `GET /api/v1/containers/{name}` - Get container details
- `POST /api/v1/containers/{name}/start` - Start container
- `POST /api/v1/containers/{name}/stop` - Stop container
- `POST /api/v1/containers/{name}/restart` - Restart container
- `GET /api/v1/containers/{name}/logs` - Get container logs
- `GET /api/v1/containers/{name}/stats` - Get container stats

### System
- `GET /api/v1/system/metrics` - System metrics (CPU, RAM, Disk)

## Services Managed

The following services are **created** but **not started** automatically. Use the API to manage them:

| Service | Port | Description |
|---------|------|-------------|
| local-postgres | 5432 | PostgreSQL 17 |
| local-dbadmin | 8080 | PgAdmin 4 |
| local-redis | 6379 | Redis 7.4 |
| local-rabbitmq | 5672, 15672 | RabbitMQ 3.13 |
| local-mongodb | 27017 | MongoDB latest |
| local-langflow | 7860 | LangFlow AI |
| local-ollama | 11434 | Ollama LLM |
| local-openwebui | 3000 | Open WebUI |
| local-jupyter | 8888 | Jupyter Notebook |

## Commands

```bash
make test    # Run 69 unit tests (coverage 92.28%)
make up      # Start API + create services
make down    # Stop all containers
make logs    # View API logs
make clean   # Clean Docker cache
```

## Testing

```bash
# Run tests with coverage
make test

# Results:
# - 69 tests (100% passing)
# - Coverage: 92.28%
# - Report: backend/htmlcov/index.html
```

## Architecture

```
MyLocalPlace API (Port 8000)
├── Manages Docker containers
├── Monitors system resources
└── Provides REST API

Services (Created, not started)
├── local-postgres
├── local-redis
├── local-rabbitmq
├── local-mongodb
├── local-langflow
├── local-ollama
├── local-openwebui
├── local-jupyter
└── local-dbadmin
```

## Development

### Project Structure

```
my-local-place/
├── Makefile                 # Commands
├── docker-compose.yml       # Orchestration
├── docs/
│   └── MyLocalPlace_API.postman_collection.json
├── backend/
│   ├── Dockerfile          # Multi-stage
│   ├── entrypoint.sh       # Commands
│   ├── requirements.txt
│   ├── requirements-dev.txt
│   ├── pytest.ini
│   ├── .coveragerc
│   ├── app/
│   │   ├── main.py
│   │   ├── core/           # Docker client
│   │   ├── repositories/   # Data access
│   │   ├── controllers/    # Business logic
│   │   ├── routers/        # Endpoints
│   │   └── schemas/        # Validation
│   └── tests/              # Unit tests
└── services/               # Service configs
```

### Code Quality

- **PEP8**: isort + black + flake8
- **Docstrings**: Google style
- **Type Hints**: 100%
- **Pattern**: Repository Pattern
- **Tests**: 92.28% coverage

## Postman Collection

Import `docs/MyLocalPlace_API.postman_collection.json` to Postman.

Contains:
- 8 requests
- 10 real examples (success + errors)
- Variable: `{{base_url}}`

## Environment Variables

Create `.env` file (optional):

```env
# API Configuration
PORT=8000
WORKERS=4
LOG_LEVEL=info

# Services (for docker-compose extends)
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your-password
# ... (see service configs)
```

## Troubleshooting

### API not connecting to Docker?

Ensure Docker socket is accessible:

```bash
ls -la /var/run/docker.sock
```

### Tests failing?

```bash
# Clean and rebuild
make down
make test
```

### Port 8000 already in use?

```bash
# Change port in docker-compose.yml
PORT=8001 make up
```

## Roadmap

- [x] Backend FastAPI
- [x] Docker SDK integration
- [x] REST API endpoints
- [x] Unit tests (92% coverage)
- [x] Postman Collection
- [ ] Frontend React (next)
- [ ] WebSocket logs
- [ ] Real-time monitoring

## License

MIT License

## Author

**Lucas Biason**
- GitHub: [@LucasBiason](https://github.com/LucasBiason)
- Project: [my-local-place](https://github.com/LucasBiason/my-local-place)

---

**Status**: Active Development
**Version**: 2.0.0
**Updated**: October 29, 2025
