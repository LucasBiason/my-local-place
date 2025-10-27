.PHONY: help setup build up down restart logs ps clean health backup

help:
	@echo "MyLocalPlace - Comandos Disponiveis:"
	@echo ""
	@echo "  make setup     - Configuracao inicial (.env)"
	@echo "  make build     - Build todos os servicos"
	@echo "  make up        - Iniciar todos os servicos"
	@echo "  make down      - Parar todos os servicos"
	@echo "  make restart   - Reiniciar todos os servicos"
	@echo "  make logs      - Ver logs em tempo real"
	@echo "  make ps        - Status dos containers"
	@echo "  make health    - Health check de todos servicos"
	@echo "  make clean     - Limpar volumes e containers"
	@echo "  make backup    - Backup dos dados"
	@echo ""

setup:
	@if [ ! -f .env ]; then \
		echo "Criando .env a partir do .env.example..."; \
		cp .env.example .env; \
		echo ".env criado! Por favor, edite com suas credenciais."; \
		echo "Execute: nano .env"; \
	else \
		echo ".env ja existe!"; \
	fi

build:
	@echo "Building services..."
	docker compose build

up:
	@echo "Starting services..."
	docker compose up -d
	@echo ""
	@echo "Services started!"
	@echo "PostgreSQL: http://localhost:8080 (PGAdmin)"
	@echo "MongoDB: http://localhost:8081"
	@echo "Redis: localhost:6379"
	@echo "Ollama WebUI: http://localhost:3000"
	@echo "LangFlow: http://localhost:7860"
	@echo ""

down:
	@echo "Stopping services..."
	docker compose down

restart:
	@echo "Restarting services..."
	docker compose restart

logs:
	@echo "Showing logs (Ctrl+C to exit)..."
	docker compose logs -f

ps:
	@echo "Container status:"
	@docker compose ps

health:
	@echo "Checking service health..."
	@echo ""
	@echo "PostgreSQL:" && docker exec local-postgres pg_isready -U postgres || echo "Not ready"
	@echo "Redis:" && docker exec local-redis redis-cli ping || echo "Not ready"
	@echo "MongoDB:" && docker exec local-mongodb mongosh --eval "db.adminCommand('ping')" --quiet || echo "Not ready"
	@echo "Ollama:" && curl -s http://localhost:11434 > /dev/null && echo "OK" || echo "Not ready"
	@echo ""

clean:
	@echo "Cleaning up..."
	@read -p "This will remove ALL volumes and data. Continue? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		docker compose down -v; \
		docker system prune -f; \
		echo "Cleanup complete!"; \
	else \
		echo "Cancelled"; \
	fi

backup:
	@echo "Creating backup..."
	@mkdir -p backups
	@echo "Backing up PostgreSQL..."
	@docker exec local-postgres pg_dumpall -U postgres > backups/postgres_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Backing up MongoDB..."
	@docker exec local-mongodb mongodump --archive > backups/mongodb_$(shell date +%Y%m%d_%H%M%S).archive
	@echo "Backup complete! Check backups/ folder"
