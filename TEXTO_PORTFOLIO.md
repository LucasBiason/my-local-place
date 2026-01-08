# Texto para Portfolio — My Local Place

Use este texto no seu portfolio (seção de projetos).

---

## Versão Curta (Card do Portfolio)

**My Local Place — Local Infrastructure Platform**

A Docker-based platform designed to standardize and simplify local development environments. It provides an operational dashboard to manage containers, monitor resource usage and inspect logs, helping developers reduce setup friction and improve productivity.

Built from real-world needs and evolved through years of hands-on usage in backend, data and AI workflows.

**Stack:** Docker, Docker Compose, Python, FastAPI, React, TypeScript, Observability, DevEx

**Links:**
- 🔗 [GitHub](https://github.com/LucasBiason/my-local-place)
- 📖 [Documentation](https://github.com/LucasBiason/my-local-place#readme)

---

## Versão Detalhada (Página do Projeto no Portfolio)

### Contexto

Setting up local development environments is often repetitive, error-prone and time-consuming. Each project requires different services (databases, message brokers, cache stores), and managing these manually leads to inconsistent environments across machines and developers.

### Problema

Developers lose significant time:
- Configuring services individually for each project
- Debugging environment inconsistencies
- Managing multiple terminal windows for logs and metrics
- Onboarding new team members to local setups

### Solução

**My Local Place** is a modular Docker-based platform that centralizes infrastructure tools into a single, observable and reproducible local environment. It provides:

- **Modular service composition** — Start only what you need (PostgreSQL, Redis, Kafka, Ollama, etc.)
- **Operational dashboard** — Monitor containers, resource usage and logs in one place
- **Easy reproducibility** — Same environment works across machines and developers
- **Developer experience focus** — Reduce setup time from hours to minutes

### Arquitetura

The platform follows a modular architecture:

- **FastAPI backend** — Orchestrates Docker containers via Docker SDK
- **React frontend** — Provides operational dashboard for container management
- **Service isolation** — Each service is independent and can be started individually
- **Docker Compose** — Manages service lifecycle and networking

### Destaques Técnicos

- **92.28% test coverage** — 69 tests covering all major components
- **Type-safe stack** — Full TypeScript in frontend, Pydantic in backend
- **Resource monitoring** — Real-time CPU and memory metrics per container
- **Log streaming** — Real-time log visualization with timestamps
- **Health checks** — All services include health checks for reliability

### Stack

**Backend:** Python 3.13, FastAPI, Docker SDK, Pydantic  
**Frontend:** React 18, TypeScript 5, Vite 6, TailwindCSS, Recharts  
**Infrastructure:** Docker, Docker Compose, Multi-stage builds

### Impacto

- **Redução de tempo de setup** — De horas para minutos
- **Ambientes consistentes** — Mesmo ambiente funciona em qualquer máquina
- **Melhor visibilidade** — Monitoramento de recursos em tempo real
- **Base para crescimento** — Fácil adicionar novos serviços conforme necessidade

### Status

📍 **Em uso ativo** — Utilizado diariamente para desenvolvimento backend, pipelines de dados, experimentos de IA e automação de workflows.

### Links

- 🔗 [GitHub Repository](https://github.com/LucasBiason/my-local-place)
- 📖 [Documentation](https://github.com/LucasBiason/my-local-place#readme)
- 📊 [Coverage Report](https://github.com/LucasBiason/my-local-place/blob/main/backend/htmlcov/index.html)

---

## Por que este projeto é relevante?

Este projeto demonstra:

- **Pensamento de plataforma** — Resolver problemas que afetam múltiplos projetos
- **Foco em Developer Experience** — Priorizar produtividade do desenvolvedor
- **Engenharia pragmática** — Balancear simplicidade com funcionalidade
- **Conhecimento de infraestrutura** — Docker, orquestração e observabilidade
- **Visão de longo prazo** — Projeto que evolui com necessidades reais

---

**Built from real-world needs and evolved through years of hands-on usage in backend, data and AI workflows.**

