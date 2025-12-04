# Changelog

All notable changes to MyLocalPlace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.1.0] - 2025-12-04

### Added

#### Backend
- Container rebuild endpoint (`POST /api/v1/containers/{name}/rebuild`)
- `rebuild_container` method in `DockerRepository` for rebuilding containers via docker-compose
- Rebuild functionality in `ContainerController` to trigger container rebuilds

#### Frontend
- Rebuild button in `ContainerCard` component with Wrench icon
- `rebuildContainer` API function in `api.ts`
- `handleRebuild` hook in `useContainers` for container rebuild operations
- Rebuild handler integration in `ContainerGrid` and `App` components

#### Infrastructure
- N8N service integration (`services/n8n.yml`)
- N8N environment configuration files (`configs/n8n.env`, `configs/n8n.env.example`)
- N8N data volume in docker-compose

### Changed
- Updated `docker-compose.yml` to include N8N service with environment file support
- Enhanced container management UI with rebuild capability

### Technical Details

#### Rebuild Feature
- Rebuild process: stops container → builds with `--no-cache` → restarts container
- Uses docker-compose for service-specific rebuilds
- Automatic container list refresh after rebuild completion
- Error handling and user feedback in UI

#### N8N Integration
- Memory optimization (512MB limit)
- Telemetry disabled
- Timezone configured (America/Sao_Paulo)
- Health check configured
- Sensitive variables externalized to `.env` file

## [2.0.0] - 2025-10-30

### Added

#### Backend
- FastAPI REST API for Docker container management
- Repository Pattern architecture with `DockerRepository` and `VolumeRepository`
- Comprehensive unit tests with pytest (69 tests, 92.28% coverage)
- Real-time container statistics (CPU, RAM, Network)
- System resource monitoring (CPU, Memory, Disk)
- Resource alert system for high usage detection
- Volume management and cleanup endpoints
- Health check endpoint with Docker connection status
- Postman Collection with real API examples
- Docker SDK 7.1 integration
- WebSocket support for future log streaming
- PEP8 compliance (isort, black, flake8)

#### Frontend
- React 18 + TypeScript 5 dashboard
- Modern UI with TailwindCSS 3 and dark mode
- Recharts integration for resource visualization
- Custom hooks for state management:
  - `useContainers` - Container list with 10-minute refresh
  - `useHealth` - API health check
  - `useSystemMetrics` - System monitoring with 5-second refresh
  - `useContainerFilter` - Local filtering
  - `useContainerStats` - Individual container metrics
- Components:
  - `ContainerCard` with Spike Admin style colored corners
  - `SystemMetricsChart` with 3 metric cards
  - `SystemUsageChart` with combined CPU/RAM/Disk graph
  - `ContainersComparisonChart` with metric toggles
  - `LogsModal` for container logs
  - `Header` with dark blue gradient
  - `Logo` with custom design
- Container type classification with Lucide icons
- Responsive design for desktop and mobile
- JSDoc complete documentation

#### Infrastructure
- Multi-stage Dockerfiles for backend and frontend
- Docker Compose with profiles (`api`, `frontend`, `full`, `test`, `services`)
- Nginx configuration for frontend SPA routing
- Unified service orchestration (9 services)
- Makefile with automation commands
- Systemd service file for boot autostart
- LLM integration (Qwen2.5-Coder 3B)

#### Documentation
- Complete README with architecture and screenshots
- Systemd autostart setup guide (inline in README)
- Postman Collection with embedded documentation
- API endpoint documentation (OpenAPI/Swagger)
- Code quality standards (PEP8, JSDoc)

### Changed
- Migrated from Streamlit dashboard to React + TypeScript
- Replaced individual container metrics with unified charts
- Optimized refresh strategy to reduce API calls and eliminate UI flicker
- Moved project from `Projetos de Portifolio` to `Projetos/Infraestrutura`

### Removed
- Old Streamlit dashboard (`dashboard/`)
- Educational React tutorial (`frontend/GUIA_DE_ESTUDOS_REACT.md`)
- Redundant Docker Compose files (consolidated to one)

### Fixed
- Container card flickering during metric updates
- Docker SDK compatibility with Python 3.13 (Pydantic downgrade)
- Test coverage extraction in CI/CD pipeline
- Docker socket permissions in test containers

### Technical Details

#### Backend Stack
- Python 3.13
- FastAPI 0.115
- Pydantic 2.10
- Uvicorn 0.32
- Docker SDK 7.1
- psutil, websockets
- pytest, httpx, coverage

#### Frontend Stack
- React 18.3
- TypeScript 5.6
- Vite 6.0
- TailwindCSS 3.4
- Recharts 2.14
- Axios 1.7
- Lucide React 0.460

#### Test Coverage
- Total: 92.28%
- Controllers: 100%
- Repositories: 100%
- Routers: 91%
- Schemas: 100%
- Core: 100%

## [1.0.0] - Previous Version

### Initial Release
- Streamlit-based dashboard
- Basic Docker container listing
- Manual start/stop controls

---

**Project Status**: Production Ready  
**Current Version**: 2.0.0  
**Last Updated**: October 30, 2025
