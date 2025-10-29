.PHONY: help install dev build up down logs test clean format lint

help:
	@echo "MyLocalPlace Backend - Available Commands:"
	@echo ""
	@echo "  Development:"
	@echo "    make install    - Install dependencies in venv"
	@echo "    make dev        - Run API locally (port 8000)"
	@echo ""
	@echo "  Docker:"
	@echo "    make build      - Build Docker image"
	@echo "    make up         - Start API in Docker"
	@echo "    make down       - Stop Docker containers"
	@echo "    make logs       - Show API logs"
	@echo ""
	@echo "  Code Quality:"
	@echo "    make format     - Format code (isort + black)"
	@echo "    make lint       - Check code quality (flake8)"
	@echo ""
	@echo "  Cleanup:"
	@echo "    make clean      - Remove cache and temp files"

install:
	@echo "📦 Installing dependencies..."
	python -m venv venv
	. venv/bin/activate && pip install --upgrade pip
	. venv/bin/activate && pip install -r requirements.txt
	@echo "✅ Dependencies installed"

dev:
	@echo "🚀 Starting API locally..."
	. venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

build:
	@echo "🏗️  Building Docker image..."
	docker-compose build
	@echo "✅ Image built successfully"

up:
	@echo "🐳 Starting API in Docker..."
	docker-compose up -d
	@echo "✅ API running at http://localhost:8000"
	@echo "📖 Docs at http://localhost:8000/docs"

down:
	@echo "🛑 Stopping Docker containers..."
	docker-compose down
	@echo "✅ Containers stopped"

logs:
	@echo "📋 Showing API logs..."
	docker-compose logs -f api

format:
	@echo "🎨 Formatting code..."
	. venv/bin/activate && python -m isort app/ --profile black --line-length 79
	. venv/bin/activate && python -m black app/ --line-length 79
	@echo "✅ Code formatted"

lint:
	@echo "🔍 Checking code quality..."
	. venv/bin/activate && python -m flake8 app/ --max-line-length=79 --extend-ignore=E203,W503
	@echo "✅ No linting errors"

clean:
	@echo "🧹 Cleaning cache and temp files..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.py~" -delete
	@echo "✅ Cleanup complete"

