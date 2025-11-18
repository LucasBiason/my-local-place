#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# Notion MCP bootstrapper
# -----------------------------------------------------------------------------
# Mantém o container `notion-mcp` do docker-compose ativo e executa o servidor
# MCP via `docker compose exec`, preservando o STDIO exigido pelo Cursor.
# -----------------------------------------------------------------------------

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_ENV="${ROOT_DIR}/configs/notion-mcp.env"

if [[ -n "${NOTION_ENV_FILE:-}" ]]; then
  ENV_FILE="$NOTION_ENV_FILE"
elif [[ -f "$DEFAULT_ENV" ]]; then
  ENV_FILE="$DEFAULT_ENV"
else
  echo "[notion-mcp] Nenhum arquivo de ambiente encontrado." >&2
  echo "Crie configs/notion-mcp.env ou defina NOTION_ENV_FILE." >&2
  exit 1
fi

cd "$ROOT_DIR"
export NOTION_ENV_FILE="$ENV_FILE"

# Garante que o serviço base esteja rodando (modo daemon).
docker compose up -d notion-mcp >/dev/null

# Anexa STDIO ao processo do servidor dentro do container.
exec docker compose exec -T notion-mcp notion-mcp-server
