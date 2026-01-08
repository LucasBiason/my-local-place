# My Local Place — Local Infrastructure Platform for Developers

> A developer-focused platform to manage, observe and standardize local development environments using Docker.

[![Python](https://img.shields.io/badge/python-3.13-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB.svg)](https://react.dev/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![Coverage](https://img.shields.io/badge/coverage-92.28%25-success.svg)](backend/htmlcov/index.html)

---

## Overview

**My Local Place** is a local infrastructure platform created to improve developer experience when working with multiple backend, data and AI services.

The project centralizes commonly used tools such as databases, message brokers and AI runtimes into a single, observable and reproducible local environment. It allows developers to start, stop, rebuild and monitor services with minimal friction.

---

## Why This Project Exists

Setting up local development environments is often repetitive, error-prone and time-consuming. Over the years, this project evolved from a simple setup guide into a platform designed to:

- **Reduce environment setup time** — Get all services running with minimal configuration
- **Improve reproducibility** — Consistent environments across machines and developers
- **Provide visibility** — Monitor resource usage and inspect logs in real-time
- **Focus on development** — Spend less time managing tools, more time building software

This platform originated from **real personal needs** and has been used daily in backend, data and AI workflows.

---

## Core Features

### Infrastructure Services

Modular composition of commonly used services:

- **Databases:** PostgreSQL, MongoDB, MySQL
- **Message Brokers:** RabbitMQ, Kafka
- **Cache & Storage:** Redis
- **Automation:** n8n (workflow automation)
- **AI/ML:** Ollama (local LLMs), LangFlow (AI workflows), Jupyter
- **PDF Processing:** BentoPDF

### Operational Dashboard

A lightweight frontend provides essential operational visibility:

- **Container lifecycle management** — Start, stop, restart services
- **Resource monitoring** — CPU and memory usage per container
- **Log visualization** — Real-time log streaming
- **System metrics** — Overall system resource usage

### Design Principles

- **Modular architecture** — Each service is isolated and can be started independently
- **Simplicity over completeness** — Focus on essential operational needs, not full observability platforms
- **Developer-first** — Optimized for local development experience
- **Extensible** — Easy to add new services or workflows

---

## Architecture

The platform follows a **modular architecture** where each service is isolated and can be started independently.

A lightweight **FastAPI backend** orchestrates Docker containers and exposes control and monitoring capabilities. A simple **React frontend** provides operational visibility, resource usage insights and access to logs.

### Components

```
┌─────────────────┐
│  React Frontend │  ← Operational dashboard
└────────┬────────┘
         │
┌────────▼────────┐
│  FastAPI Backend│  ← Container orchestration
└────────┬────────┘
         │
┌────────▼────────┐
│ Docker Services │  ← PostgreSQL, Redis, Kafka, etc.
└─────────────────┘
```

### Service Isolation

Each service is defined in its own `docker-compose` file under `/services`, allowing:

- Independent lifecycle management
- Service-specific configuration
- Easy addition of new services
- Composition of services based on project needs

---

## Design Decisions

### Why Docker?

Docker was chosen to ensure **environment reproducibility across machines**. Developers can run the same services consistently, regardless of their local OS or configuration.

### Why Modular Services?

Each service is isolated to allow **independent usage**. You can start only what you need for a specific project, reducing resource usage and startup time.

### Why a Simple Frontend?

The frontend is intentionally minimal and focused on **operational needs**. It's not meant to replace full observability platforms (like Grafana), but to provide essential visibility during local development.

### Why FastAPI Backend?

FastAPI provides a lightweight, fast and well-documented API for container orchestration. It's perfect for internal tooling that doesn't require complex business logic.

---

## Quick Start

### Prerequisites

- Docker 24+
- Docker Compose 2+
- Make (optional, for convenience commands)

### Installation

```bash
git clone https://github.com/LucasBiason/my-local-place.git
cd my-local-place

# Copy environment variables (if needed)
cp configs/*.env.example configs/*.env
```

### Running the Platform

```bash
# Start API only
make dev

# Start API + Frontend
make dev-full

# Start specific services (e.g., PostgreSQL and Redis)
docker compose up local-postgres local-redis

# Start all services
docker compose --profile services up
```

Access:
- **Frontend Dashboard:** http://localhost:3000
- **API:** http://localhost:8800
- **API Docs:** http://localhost:8800/docs

---

## Usage Examples

### Backend Development

```bash
# Start PostgreSQL and Redis for backend development
docker compose up local-postgres local-redis
```

### Data Pipeline Development

```bash
# Start Kafka, PostgreSQL and Redis for data pipelines
docker compose up local-kafka local-postgres local-redis
```

### AI/ML Experiments

```bash
# Start Ollama and Jupyter for AI experiments
docker compose up local-ollama local-jupyter
```

### Full Stack with Automation

```bash
# Start all services including automation tools
docker compose --profile services up
```

---

## Available Services

### Databases

- **PostgreSQL** (`local-postgres`) — SQL database with pgAdmin interface
- **MongoDB** (`local-mongo`) — NoSQL database
- **MySQL** (`local-mysql`) — SQL database alternative

### Message Brokers

- **RabbitMQ** (`local-rabbitmq`) — Message queue with management UI
- **Kafka** (`local-kafka`) — Distributed streaming platform

### Cache & Storage

- **Redis** (`local-redis`) — In-memory data store and cache

### Automation & Workflows

- **n8n** (`local-n8n`) — Workflow automation platform
- **Jupyter** (`local-jupyter`) — Interactive notebooks for data science

### AI/ML Services

- **Ollama** (`local-ollama`) — Local LLM runtime (e.g., Qwen2.5-Coder 3B)
- **LangFlow** (`local-langflow`) — Visual AI workflow builder

### Utilities

- **BentoPDF** (`local-bentopdf`) — PDF processing service

Each service can be started independently and exposes ports for local development.

---

## Extending the Platform

To add a new service (e.g., RabbitMQ):

1. Create a new service file under `/services` (e.g., `services/rabbitmq.yml`)
2. Define the service with Docker Compose syntax
3. Reference it in the main `docker-compose.yml` using `extends`
4. Add a profile if you want it optional (e.g., `profiles: ["services"]`)
5. Update this README with service documentation

Example:

```yaml
# services/rabbitmq.yml
services:
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"      # AMQP
      - "15672:15672"    # Management UI
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
```

---

## Observability Dashboard

The frontend is intentionally minimal and focused on operational needs:

- **Container lifecycle management** — Start, stop, restart, rebuild services
- **Resource usage monitoring** — CPU and memory usage per container
- **Log visualization** — Real-time log streaming with timestamps
- **System metrics** — Overall CPU, memory and disk usage

The goal is **not to replace full observability platforms** (like Prometheus + Grafana), but to provide **essential visibility during local development**.

---

## Testing

```bash
# Run all tests
make test

# Run tests with coverage report
docker compose run --rm test

# View coverage report
open backend/htmlcov/index.html
```

**Coverage:** 92.28% (69 tests)

---

## Tech Stack

### Backend
- Python 3.13
- FastAPI 0.115
- Docker SDK 7.1
- Pydantic 2.10
- Uvicorn 0.32

### Frontend
- React 18
- TypeScript 5
- Vite 6
- TailwindCSS 3
- Recharts 2 (for metrics visualization)
- Lucide React (icons)

### Infrastructure
- Docker & Docker Compose
- Multi-stage builds
- Service isolation with profiles

---

## Project Status

📍 **In active use**

This platform is used daily for backend development, data pipelines, AI experiments and workflow automation. It's continuously evolved based on real development needs.

---

## Contributing

This is a personal project, but suggestions and improvements are welcome. If you want to adapt it for your own use:

1. Fork the repository
2. Customize services based on your needs
3. Add services you commonly use
4. Share your improvements if they might benefit others

---

## License

This project is provided as-is for personal and educational use.

---

## Author

**Lucas Biason**

Senior Backend Engineer | Python, APIs & Intelligent Systems

- 🌐 [Portfolio](https://lucasbiason.com)
- 💼 [LinkedIn](https://www.linkedin.com/in/lucas-biason)
- 🔗 [GitHub](https://github.com/LucasBiason)

---

## Why This Project Matters

This project demonstrates:

- **Problem-solving mindset** — Identifying real friction points in developer workflows
- **Platform thinking** — Building solutions that benefit multiple use cases
- **Pragmatic engineering** — Balancing simplicity with functionality
- **Developer experience focus** — Prioritizing developer productivity over complexity
- **Infrastructure knowledge** — Understanding containers, orchestration and observability

It's not just about Docker — it's about **reducing friction so developers can focus on building software**.

---

**Built from real-world needs and evolved through years of hands-on usage in backend, data and AI workflows.**
