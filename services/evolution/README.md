# Evolution API - WhatsApp Integration

Evolution API é uma API REST para integração com WhatsApp, permitindo envio e recebimento de mensagens via WhatsApp através de uma interface HTTP.

## Características

- ✅ API REST completa para WhatsApp
- ✅ Suporte a múltiplas instâncias (multitenancy)
- ✅ Integração com PostgreSQL para persistência
- ✅ QR Code para conexão
- ✅ Webhooks para eventos
- ✅ Suporte a mídia (imagens, documentos, áudio)

## Configuração

### Variáveis de Ambiente

Copiar arquivo de exemplo e configurar:

```bash
cd /home/lucas-biason/Projetos/Infraestrutura/my-local-place
cp configs/evolution.env.example configs/evolution.env
# Editar configs/evolution.env com suas configurações
```

Ver `configs/evolution.env.example` para todas as variáveis disponíveis.

### Banco de Dados

Antes de iniciar o Evolution, criar o banco de dados:

```bash
# Conectar ao PostgreSQL
docker exec -it local-postgres psql -U postgres

# Criar banco e usuário
CREATE DATABASE evolution_db;
CREATE USER evolution_user WITH PASSWORD 'senha_segura';
GRANT ALL PRIVILEGES ON DATABASE evolution_db TO evolution_user;
\q
```

## Uso

### Iniciar Serviço

```bash
cd /home/lucas-biason/Projetos/Infraestrutura/my-local-place
docker-compose up -d local-evolution
```

### Verificar Status

```bash
# Ver logs
docker-compose logs -f local-evolution

# Verificar saúde
curl http://localhost:8080/health
```

### Criar Instância

```bash
curl -X POST http://localhost:8080/instance/create \
  -H "apikey: sua_chave_aqui" \
  -H "Content-Type: application/json" \
  -d '{
    "instanceName": "minha_instancia",
    "qrcode": true
  }'
```

### Obter QR Code

```bash
curl http://localhost:8080/instance/fetchInstances \
  -H "apikey: sua_chave_aqui"
```

## Integração com Projetos

### Variáveis de Ambiente no Projeto

```bash
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=sua_chave_aqui
EVOLUTION_INSTANCE_NAME=nome_instancia
```

### Exemplo de Uso (Python)

```python
import requests

EVOLUTION_API_URL = "http://localhost:8080"
EVOLUTION_API_KEY = "sua_chave_aqui"
INSTANCE_NAME = "minha_instancia"

# Enviar mensagem
response = requests.post(
    f"{EVOLUTION_API_URL}/message/sendText/{INSTANCE_NAME}",
    headers={"apikey": EVOLUTION_API_KEY},
    json={
        "number": "5511999999999",
        "text": "Olá! Esta é uma mensagem de teste."
    }
)
```

## Documentação

- **Repositório:** https://github.com/EvolutionAPI/evolution-api
- **Documentação:** https://doc.evolution-api.com/
- **Docker Image:** `atendai/evolution-api:2.3.6`

## Notas

- Evolution requer PostgreSQL para funcionar corretamente
- A API key deve ter pelo menos 32 caracteres
- Use URL encoding na senha do banco se contiver caracteres especiais
- O serviço depende do `local-postgres` estar rodando

