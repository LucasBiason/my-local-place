#!/bin/bash
set -e

echo "======================================================================"
echo "MIGRACAO COMPLETA DE BANCOS DE DADOS"
echo "======================================================================"
echo ""

# Verificar se volume antigo existe
if ! docker volume ls | grep -q "globaldatabank_postgres"; then
    echo "ERRO: Volume globaldatabank_postgres nao encontrado!"
    echo "Volumes disponiveis:"
    docker volume ls | grep postgres
    exit 1
fi

echo "1. Parando containers atuais..."
docker compose down 2>/dev/null || true
echo "OK"
echo ""

# Criar diretorio de backup
mkdir -p backups/migration
BACKUP_DIR="backups/migration/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "2. Iniciando container temporario com volume antigo..."
docker run -d --name temp-old-postgres \
    -e POSTGRES_USER=${POSTGRES_USER:-postgres} \
    -e POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-postgres} \
    -v globaldatabank_postgres:/data/postgres \
    -e PGDATA=/data/postgres \
    postgres:15

echo "Aguardando PostgreSQL antigo iniciar..."
sleep 10

# Verificar se iniciou
if ! docker ps | grep -q "temp-old-postgres"; then
    echo "ERRO: Container temporario nao iniciou!"
    docker logs temp-old-postgres
    exit 1
fi

echo "OK"
echo ""

echo "3. Fazendo backup completo (pg_dumpall)..."
docker exec temp-old-postgres pg_dumpall -U ${POSTGRES_USER:-postgres} > "$BACKUP_DIR/full_backup.sql"

if [ $? -eq 0 ]; then
    echo "OK - Backup salvo em: $BACKUP_DIR/full_backup.sql"
    echo "   Tamanho: $(du -h "$BACKUP_DIR/full_backup.sql" | cut -f1)"
else
    echo "ERRO: Falha ao fazer backup!"
    docker stop temp-old-postgres
    docker rm temp-old-postgres
    exit 1
fi
echo ""

echo "4. Listando bancos de dados encontrados:"
docker exec temp-old-postgres psql -U ${POSTGRES_USER:-postgres} -c "\l" | grep -E "^\s+\w+" | awk '{print "   - " $1}'
echo ""

echo "5. Parando container temporario..."
docker stop temp-old-postgres
docker rm temp-old-postgres
echo "OK"
echo ""

echo "6. Iniciando novo PostgreSQL (postgres:17-alpine)..."
docker compose up -d local-postgres

echo "Aguardando novo PostgreSQL iniciar..."
sleep 15

# Verificar health
for i in {1..30}; do
    if docker compose ps local-postgres | grep -q "healthy"; then
        echo "OK - PostgreSQL healthy!"
        break
    fi
    echo "Aguardando... ($i/30)"
    sleep 2
done
echo ""

echo "7. Restaurando dados no novo PostgreSQL..."
cat "$BACKUP_DIR/full_backup.sql" | docker exec -i local-postgres psql -U ${POSTGRES_USER:-postgres}

if [ $? -eq 0 ]; then
    echo "OK - Dados restaurados com sucesso!"
else
    echo "ERRO: Falha ao restaurar dados!"
    echo "Backup preservado em: $BACKUP_DIR/full_backup.sql"
    exit 1
fi
echo ""

echo "8. Verificando bancos restaurados:"
docker exec local-postgres psql -U ${POSTGRES_USER:-postgres} -c "\l" | grep -E "^\s+\w+" | awk '{print "   - " $1}'
echo ""

echo "9. Criando banco langflow (se nao existir)..."
docker exec local-postgres psql -U ${POSTGRES_USER:-postgres} -c "CREATE DATABASE langflow;" 2>/dev/null || echo "   Banco langflow ja existe"
docker exec local-postgres psql -U ${POSTGRES_USER:-postgres} -c "GRANT ALL PRIVILEGES ON DATABASE langflow TO ${POSTGRES_USER:-postgres};"
echo "OK"
echo ""

echo "======================================================================"
echo "MIGRACAO CONCLUIDA COM SUCESSO!"
echo "======================================================================"
echo ""
echo "Resumo:"
echo "  - Backup completo: $BACKUP_DIR/full_backup.sql"
echo "  - Volume antigo: globaldatabank_postgres (preservado)"
echo "  - Volume novo: my-local-place_postgres_data"
echo ""
echo "Proximos passos:"
echo "1. Iniciar todos os servicos: docker compose up -d"
echo "2. Testar LangFlow e outros servicos"
echo "3. Se tudo OK, remover volume antigo:"
echo "   docker volume rm globaldatabank_postgres"
echo ""
echo "======================================================================"
