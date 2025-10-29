# 🏠 MyLocalPlace - Local Development Services Platform

[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://docker.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue.svg)](https://postgresql.org)
[![Redis](https://img.shields.io/badge/Redis-7.4-red.svg)](https://redis.io)
[![RabbitMQ](https://img.shields.io/badge/RabbitMQ-3.13-orange.svg)](https://rabbitmq.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **Complete local development environment with PostgreSQL 17, MongoDB, Redis 7.4, RabbitMQ, Kafka, Ollama, LangFlow and Streamlit management dashboard**

MyLocalPlace is a project that uses various tools and services to manage and analyze data. The project is configured to run in a Docker environment, making it easy to install and run the necessary services.

This Docker-configured environment includes the tools I use for local development, providing a complete infrastructure for AI/ML experimentation, microservices testing, and data analysis.

## 🌟 Key Features

✨ **All-in-One Environment** - PostgreSQL, MongoDB, Redis, Ollama, LangFlow
📊 **Streamlit Dashboard** - Visual management and observability
🐳 **Docker Orchestrated** - Easy setup with docker-compose
🔒 **Secure by Default** - Environment variables and secrets management
⚡ **Quick Commands** - Makefile with useful shortcuts
💾 **Backup Ready** - Automated backup scripts

## 🚀 Quick Start

### Prerequisites

- Docker 24+
- Docker Compose 2+
- Make (optional)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/LucasBiason/my-local-place.git
cd my-local-place
```

2. **Setup environment**
```bash
# Create .env from example
cp .env.example .env

# Edit with your credentials
nano .env
```

3. **Start all services**
```bash
# Using Make
make up

# Or using Docker Compose directly
docker compose up -d
```

4. **Access Dashboard**
```bash
# Open browser at:
http://localhost:8501
```

## 📦 Services Included

| Service | Port | Description |
|---------|------|-------------|
| 🐘 PostgreSQL 17 | 5432 | Relational database server |
| 📊 PGAdmin | 8080 | PostgreSQL management UI |
| ⚡ Redis 7.4 | 6379 | Cache and message broker |
| 🐰 RabbitMQ | 5672, 15672 | Message queue + Management UI |
| 🍃 MongoDB | 27017 | NoSQL document database |
| 📨 Kafka | 9092 | Event streaming platform |
| 🔍 Kafdrop | 19000 | Kafka UI |
| ⛓️ LangFlow | 7860 | AI workflow builder |
| 🦙 Ollama | 11434 | Local LLM server |
| 🌐 OpenWebUI | 8082 | Ollama chat interface |
| 📊 Dashboard | 8501 | Streamlit management dashboard |

## 🎯 Use Cases

### 1. Machine Learning Development
- PostgreSQL for structured data
- MongoDB for unstructured data
- Ollama for local LLMs
- LangFlow for AI workflows

### 2. Microservices Testing
- PostgreSQL for production-like DB
- Redis for caching and queues
- MongoDB for document storage

### 3. AI/LLM Experimentation
- Ollama with multiple models
- OpenWebUI for chat interface
- LangFlow for agent building

## 🛠️ Available Commands

```bash
make setup     # Initial setup (.env creation)
make build     # Build all services
make up        # Start all services
make down      # Stop all services
make restart   # Restart all services
make logs      # View logs in real-time
make ps        # Container status
make health    # Health check all services
make clean     # Clean volumes and containers
make backup    # Backup databases
```

## 📊 Dashboard Features

Access the dashboard at `http://localhost:8501`

### Features:
- ✅ **Service Status** - Real-time status of all services
- ✅ **Start/Stop/Restart** - Individual service control
- ✅ **Logs Viewer** - View logs of each service
- ✅ **System Metrics** - CPU, Memory, Disk usage
- ✅ **Quick Actions** - Start/Stop all services at once

### Dashboard Preview

```
🏠 MyLocalPlace Dashboard
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 System Info:     Total: 8   Running: 8   Stopped: 0

Services:
🐘 PostgreSQL   🟢 RUNNING  Port: 5432   [Stop] [Restart] [Logs]
📊 PGAdmin      🟢 RUNNING  Port: 8080   [Stop] [Restart] [Logs]
⚡ Redis        🟢 RUNNING  Port: 6379   [Stop] [Restart] [Logs]
...
```

## 🔐 Environment Variables

Required variables in `.env`:

```env
# PostgreSQL
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-password

# PGAdmin
PGADMIN_DEFAULT_EMAIL=your-email@example.com
PGADMIN_DEFAULT_PASSWORD=your-password

# Redis
REDIS_PASSWORD=your-password

# MongoDB
ME_CONFIG_USERNAME=your-user
ME_CONFIG_PASSWORD=your-password

# LangFlow
LANGFLOW_SUPERUSER=your-user
LANGFLOW_SUPERUSER_PASSWORD=your-password

# OpenAI (for LangFlow/Ollama)
OPENAI_API_KEY=sk-your-key-here

# OpenWebUI
WEBUI_AUTH=your-username
WEBUI_NAME=Your Dashboard Name
```

**⚠️ NEVER commit `.env` to git!**

## 🔧 Troubleshooting

### Services not starting?

```bash
# Check Docker is running
docker ps

# Check logs
make logs

# Restart all
make restart
```

### Port already in use?

Edit `docker-compose.yml` and change the port mapping:

```yaml
ports:
  - "8080:8080"  # Change first number (host port)
```

### Dashboard can't connect to Docker?

Make sure Docker socket is mounted:

```yaml
volumes:
  - /var/run/docker.sock:/var/run/docker.sock
```

### Health check failing?

```bash
# Check individual service
make health

# Check container logs
docker logs local-postgres
```

## 💾 Backup & Restore

### Backup

```bash
# Backup all databases
make backup

# Backups are saved in backups/ folder
```

### Restore

```bash
# PostgreSQL
docker exec -i local-postgres psql -U postgres < backups/postgres_YYYYMMDD_HHMMSS.sql

# MongoDB
docker exec -i local-mongodb mongorestore --archive < backups/mongodb_YYYYMMDD_HHMMSS.archive
```

## 📁 Project Structure

```
my-local-place/
├── services/              # Service configurations
│   ├── postgres.yml      # PostgreSQL + PGAdmin
│   ├── redis.yml         # Redis
│   ├── mongo.yml         # MongoDB
│   ├── langflow.yml      # LangFlow
│   ├── ollama.yml        # Ollama + OpenWebUI
│   ├── kafka.yml         # Kafka (optional)
│   └── mysql.yml         # MySQL (optional)
│
├── dashboard/            # Streamlit Dashboard
│   ├── app.py           # Main dashboard
│   ├── pages/           # Additional pages
│   ├── requirements.txt
│   └── Dockerfile
│
├── backups/             # Database backups
│
├── docker-compose.yml   # Main orchestration
├── Makefile            # Useful commands
├── .env.example        # Environment template
├── .editorconfig       # Code style
├── .gitignore          # Git ignore rules
└── README.md           # This file
```

## 🚀 Advanced Usage

### Adding a New Service

1. Create service config in `services/myservice.yml`
2. Add to `docker-compose.yml`:

```yaml
my-service:
  extends:
    file: services/myservice.yml
    service: myservice
  networks:
    - local-services-network
```

3. Update dashboard to include new service

### Using with Your Projects

```yaml
# In your project's docker-compose.yml
networks:
  default:
    external: true
    name: my-local-place_local-services-network

services:
  my-app:
    ...
    environment:
      - DATABASE_URL=postgresql://user:pass@local-postgres:5432/mydb
```

## 📚 Documentation

- [Complete Roadmap](ROADMAP_COMPLETO.md) - Full evolution plan
- [Service Configs](services/) - Individual service configurations
- [Dashboard Guide](dashboard/) - Dashboard usage guide

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 👤 Author

**Lucas Biason**
- GitHub: [@LucasBiason](https://github.com/LucasBiason)
- LinkedIn: [lucasbiason](https://linkedin.com/in/lucasbiason)

---

**Status:** 🚀 Active Development
**Version:** 2.0.0
**Last Updated:** October 2025
