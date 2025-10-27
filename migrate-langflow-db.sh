#!/bin/bash
set -e

echo "======================================================================"
echo "MIGRACAO LANGFLOW-DB -> POSTGRES PRINCIPAL"
echo "======================================================================"
echo ""

# Verificar se containers estao rodando
echo "1. Verificando containers..."
if ! docker ps | grep -q "local-langflow-db"; then
    echo "ERRO: Container local-langflow-db nao esta rodando!"
    echo "Execute: docker compose up -d local-langflow-db"
    exit 1
fi

if ! docker ps | grep -q "local-postgres"; then
    echo "ERRO: Container local-postgres nao esta rodando!"
    echo "Execute: docker compose up -d local-postgres"
    exit 1
fi

echo "OK - Containers rodando"
echo ""

# Criar diretorio de backup
mkdir -p backups/migration
BACKUP_FILE="backups/migration/langflow_$(date +%Y%m%d_%H%M%S).sql"

echo "2. Fazendo backup do banco langflow..."
docker exec local-langflow-db pg_dump -U ${POSTGRES_USER:-postgres} -d langflow > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "OK - Backup salvo em: $BACKUP_FILE"
    echo "   Tamanho: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "ERRO: Falha ao fazer backup!"
    exit 1
fi
echo ""

echo "3. Criando banco langflow no PostgreSQL principal..."
docker exec local-postgres psql -U ${POSTGRES_USER:-postgres} -c "CREATE DATABASE langflow;" 2>/dev/null || echo "   Banco langflow ja existe (OK)"
docker exec local-postgres psql -U ${POSTGRES_USER:-postgres} -c "GRANT ALL PRIVILEGES ON DATABASE langflow TO ${POSTGRES_USER:-postgres};"
echo "OK - Banco langflow criado/verificado"
echo ""

echo "4. Restaurando dados no PostgreSQL principal..."
cat "$BACKUP_FILE" | docker exec -i local-postgres psql -U ${POSTGRES_USER:-postgres} -d langflow

if [ $? -eq 0 ]; then
    echo "OK - Dados restaurados com sucesso!"
else
    echo "ERRO: Falha ao restaurar dados!"
    echo "Backup preservado em: $BACKUP_FILE"
    exit 1
fi
echo ""

echo "5. Verificando migracao..."
TABLES_OLD=$(docker exec local-langflow-db psql -U ${POSTGRES_USER:-postgres} -d langflow -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d ' ')
TABLES_NEW=$(docker exec local-postgres psql -U ${POSTGRES_USER:-postgres} -d langflow -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema='public';" | tr -d ' ')

echo "   Tabelas no langflow-db: $TABLES_OLD"
echo "   Tabelas no postgres: $TABLES_NEW"

if [ "$TABLES_OLD" -eq "$TABLES_NEW" ]; then
    echo "OK - Migracao verificada com sucesso!"
else
    echo "AVISO: Numero de tabelas diferente. Verifique manualmente."
fi
echo ""

echo "======================================================================"
echo "MIGRACAO CONCLUIDA!"
echo "======================================================================"
echo ""
echo "Proximos passos:"
echo "1. Testar LangFlow com novo banco"
echo "2. Se tudo OK, parar local-langflow-db: docker stop local-langflow-db"
echo "3. Remover volume antigo: docker volume rm my-local-place_globaldatabank_langflow_db"
echo ""
echo "Backup preservado em: $BACKUP_FILE"
echo "======================================================================"
