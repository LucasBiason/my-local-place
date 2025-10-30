# Credenciais dos Serviços - MyLocalPlace

**Data**: 30/10/2025  
**Ambiente**: Desenvolvimento Local

---

## 🐘 PostgreSQL

### Conexão

**Container**: `local-postgres`

```
Host: localhost (ou local-postgres na rede Docker)
Port: 5432
Database: postgres
Username: postgres
Password: postgres
```

### Comandos

```bash
# Iniciar
docker start local-postgres

# Conectar via psql
psql -h localhost -p 5432 -U postgres -d postgres

# Verificar logs
docker logs local-postgres --tail 50
```

---

## 🛠️ PgAdmin

### Acesso Web

**Container**: `local-dbadmin`

```
URL: http://localhost:8080
Email: admin@mylocalplace.local
Password: admin
```

### Configurar Servidor PostgreSQL no PgAdmin

1. **Iniciar containers**:
   ```bash
   docker start local-postgres local-dbadmin
   ```

2. **Acessar**: http://localhost:8080

3. **Login**:
   - Email: `admin@mylocalplace.local`
   - Password: `admin`

4. **Registrar Servidor**:
   - Clique direito em "Servers" > "Register" > "Server"
   
   **General**:
   - Name: `MyLocalPlace PostgreSQL`
   
   **Connection**:
   - Host: `local-postgres` (nome do container)
   - Port: `5432`
   - Maintenance database: `postgres`
   - Username: `postgres`
   - Password: `postgres`
   - ✅ Save password
   
   **Salvar**

5. **Pronto!** Servidor aparece na árvore lateral.

---

## 🔴 Redis

**Container**: `local-redis`

```
Host: localhost (ou local-redis na rede Docker)
Port: 6379
Password: (sem senha)
```

### Comandos

```bash
# Iniciar
docker start local-redis

# Conectar
docker exec -it local-redis redis-cli

# Testar
redis-cli -h localhost -p 6379 ping
```

---

## 🐰 RabbitMQ

**Container**: `local-rabbitmq`

```
Management UI: http://localhost:15672
AMQP Port: 5672
Username: guest
Password: guest
```

---

## 🍃 MongoDB

**Container**: `local-mongodb`

```
Host: localhost (ou local-mongodb na rede Docker)
Port: 27017
Database: admin
Username: (sem autenticação padrão)
```

### Conectar

```bash
# MongoDB Compass
mongodb://localhost:27017

# Mongo Shell
docker exec -it local-mongodb mongosh
```

---

## 🤖 Ollama (LLM)

**Container**: `local-ollama`

```
API: http://localhost:11434
Model: qwen2.5-coder:3b
```

### Comandos

```bash
# Listar modelos
docker exec local-ollama ollama list

# Testar modelo
docker exec local-ollama ollama run qwen2.5-coder:3b "Write a Python function"
```

---

## 🌐 OpenWebUI

**Container**: `local-openwebui`

```
URL: http://localhost:3000
Conecta em: local-ollama
```

---

## 🎨 LangFlow

**Container**: `local-langflow`

```
URL: http://localhost:7860
Database: PostgreSQL (auto-configurado)
```

---

## 📓 Jupyter Notebook

**Container**: `local-jupyter`

```
URL: http://localhost:8888
Token: (ver logs do container)
```

### Obter Token

```bash
docker logs local-jupyter 2>&1 | grep token
```

---

## 📝 NOTAS IMPORTANTES

### Rede Docker

Todos os serviços estão na mesma rede: `local-services-network`

**Comunicação entre containers**:
- Use **nome do container** como host
- Exemplo: `local-postgres`, `local-redis`, etc.

**Comunicação de fora**:
- Use **localhost** como host
- Portas mapeadas conforme tabela acima

### Persistência

Dados persistem em volumes Docker:
- `postgres_data`
- `pgadmin_data`
- `mongodb_data`
- `ollama_data`
- etc.

### Iniciar Todos os Serviços

```bash
cd ~/Projetos/Estudos/Projetos\ de\ Portifolio/my-local-place
make up        # API + cria serviços (não inicia)
docker start local-postgres local-dbadmin local-redis  # Inicia o que precisa
```

---

**Salvo em**: `docs/CREDENCIAIS_SERVICOS.md`

