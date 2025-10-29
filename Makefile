.PHONY: help test dev dev-full build up up-full down logs clean

help:
	@echo "MyLocalPlace v2.0 - Unified Docker Management"
	@echo ""
	@echo "Main Commands:"
	@echo "  make test           - Run tests with coverage (90%+)"
	@echo "  make dev            - Start API in DEVELOPMENT mode"
	@echo "  make dev-full       - Start API + Frontend (full stack)"
	@echo "  make build          - Build production images"
	@echo "  make up             - Start MyLocalPlace API"
	@echo "  make up-full        - Start API + Frontend"
	@echo "  make down           - Stop all containers"
	@echo "  make logs           - Show API logs"
	@echo "  make clean          - Clean Docker cache"
	@echo ""
	@echo "Service Management:"
	@echo "  All services are CREATED but NOT started."
	@echo "  Use the MyLocalPlace Dashboard to start/stop services."
	@echo ""
	@echo "Architecture:"
	@echo "  - API: http://localhost:8000 (always running)"
	@echo "  - Frontend: http://localhost:3000 (optional)"
	@echo "  - Services: Managed via API/Dashboard"

test:
	@echo "Running tests with coverage..."
	@echo ""
	@docker compose --profile test down 2>/dev/null || true
	@docker compose --profile test build --no-cache test
	@docker compose --profile test up --abort-on-container-exit test
	@docker compose --profile test down
	@echo ""
	@echo "Tests complete! Coverage: backend/htmlcov/index.html"

dev:
	@echo "Starting API in DEVELOPMENT mode (hot reload)..."
	@echo ""
	@docker compose down 2>/dev/null || true
	@API_COMMAND=dev DEV_VOLUME=rw LOG_LEVEL=debug docker compose up --build mylocalplace-api
	@echo ""
	@echo "API stopped."

dev-full:
	@echo "Starting FULL STACK in DEVELOPMENT mode..."
	@echo ""
	@docker compose --profile full down 2>/dev/null || true
	@API_COMMAND=dev DEV_VOLUME=rw LOG_LEVEL=debug docker compose --profile full up --build
	@echo ""
	@echo "Services stopped."

build:
	@echo "Building PRODUCTION images..."
	docker compose build --no-cache mylocalplace-api frontend
	@echo "Production images built!"

up:
	@echo "Starting MyLocalPlace API..."
	@echo ""
	@docker compose down 2>/dev/null || true
	@docker compose up -d mylocalplace-api
	@echo ""
	@echo "Creating service containers (not started)..."
	@docker compose --profile services create
	@echo ""
	@echo "All containers ready!"
	@echo "  API: http://localhost:8000"
	@echo "  Docs: http://localhost:8000/docs"
	@echo ""
	@echo "Use the Dashboard to start services on demand."
	@echo ""
	@echo "View logs: make logs"

up-full:
	@echo "Starting FULL STACK (API + Frontend)..."
	@echo ""
	@docker compose --profile full down 2>/dev/null || true
	@docker compose --profile full up -d
	@echo ""
	@echo "Creating service containers (not started)..."
	@docker compose --profile services create
	@echo ""
	@echo "All ready!"
	@echo "  Frontend: http://localhost:3000"
	@echo "  API: http://localhost:8000"
	@echo "  Docs: http://localhost:8000/docs"
	@echo ""
	@echo "View logs: make logs"

down:
	@echo "Stopping all containers..."
	@docker compose down
	@docker compose --profile services down
	@docker compose --profile test down 2>/dev/null || true
	@echo "All containers stopped!"

logs:
	@echo "MyLocalPlace API logs (Ctrl+C to exit):"
	@echo ""
	@docker compose logs -f mylocalplace-api

clean:
	@echo "Cleaning Docker cache..."
	@docker system prune -f
	@echo "Cache cleaned!"
