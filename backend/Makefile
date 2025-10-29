.PHONY: help dev build up down logs clean

help:
	@echo "MyLocalPlace Backend - Makefile"
	@echo ""
	@echo "Development:"
	@echo "  make dev            - Start API in DEVELOPMENT mode (hot reload)"
	@echo "  make logs           - Show API logs"
	@echo ""
	@echo "Production:"
	@echo "  make build          - Build production image"
	@echo "  make up             - Start API in PRODUCTION mode"
	@echo "  make down           - Stop all containers"
	@echo ""
	@echo "Utilities:"
	@echo "  make clean          - Clean cache and temporary files"
	@echo ""
	@echo "NOTE: API runs ONLY in Docker (like ML Sales Forecasting)"

dev:
	@echo "Starting API in DEVELOPMENT mode (hot reload)..."
	@echo ""
	@docker compose --profile api down 2>/dev/null || true
	@API_COMMAND=dev DEV_VOLUME=rw LOG_LEVEL=debug docker compose --profile api up --build
	@echo ""
	@echo "API stopped."

build:
	@echo "Building PRODUCTION image..."
	docker compose build --no-cache api
	@echo "Production image built!"

up:
	@echo "Starting PRODUCTION API..."
	@docker compose --profile api down 2>/dev/null || true
	@API_COMMAND=runserver DEV_VOLUME=ro WORKERS=4 LOG_LEVEL=info docker compose --profile api up -d
	@echo ""
	@echo "API running!"
	@echo "  URL: http://localhost:8000"
	@echo "  Docs: http://localhost:8000/docs"
	@echo ""
	@echo "View logs: make logs"

down:
	@echo "Stopping all containers..."
	@docker compose --profile api down 2>/dev/null || true
	@echo "Stopped!"

logs:
	@echo "Logs (Ctrl+C to exit):"
	@echo ""
	@docker compose logs -f api

clean:
	@echo "Cleaning cache and temporary files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete 2>/dev/null || true
	@echo "Cleanup complete!"
