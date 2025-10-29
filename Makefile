.PHONY: help up down logs clean

help:
	@echo "MyLocalPlace v2.0 - Unified Docker Management"
	@echo ""
	@echo "Main Commands:"
	@echo "  make up             - Start MyLocalPlace API (auto-starts)"
	@echo "  make down           - Stop all containers"
	@echo "  make logs           - Show API logs"
	@echo "  make clean          - Clean Docker cache"
	@echo ""
	@echo "Service Management:"
	@echo "  All services are CREATED but NOT started."
	@echo "  Use the MyLocalPlace Dashboard to start/stop services."
	@echo ""
	@echo "Architecture:"
	@echo "  - MyLocalPlace API: http://localhost:8000 (always running)"
	@echo "  - Services: Managed via API/Dashboard"
	@echo ""
	@echo "Services Available:"
	@echo "  - local-postgres (5432)"
	@echo "  - local-redis (6379)"
	@echo "  - local-rabbitmq (5672, 15672)"
	@echo "  - local-mongodb (27017)"
	@echo "  - local-langflow (7860)"
	@echo "  - local-ollama (11434)"
	@echo "  - local-jupyter (8888)"

up:
	@echo "Starting MyLocalPlace API..."
	@echo ""
	@docker compose up -d mylocalplace-api
	@echo ""
	@echo "MyLocalPlace API running!"
	@echo "  API: http://localhost:8000"
	@echo "  Docs: http://localhost:8000/docs"
	@echo ""
	@echo "Creating service containers (not started)..."
	@docker compose --profile services create
	@echo ""
	@echo "All containers created!"
	@echo "Use the Dashboard to start services on demand."
	@echo ""
	@echo "View logs: make logs"

down:
	@echo "Stopping all containers..."
	@docker compose down
	@docker compose --profile services down
	@echo "All containers stopped!"

logs:
	@echo "MyLocalPlace API logs (Ctrl+C to exit):"
	@echo ""
	@docker compose logs -f mylocalplace-api

clean:
	@echo "Cleaning Docker cache..."
	@docker system prune -f
	@echo "Cache cleaned!"
