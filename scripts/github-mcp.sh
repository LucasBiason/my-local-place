#!/usr/bin/env bash
set -euo pipefail

# -----------------------------------------------------------------------------
# GitHub MCP bootstrapper
# -----------------------------------------------------------------------------
# Wrapper responsável por iniciar o container oficial `ghcr.io/github/github-mcp-server`
# com o token presente em `configs/github-mcp.env`. O script é chamado pelo Cursor
# para garantir que o servidor MCP tenha STDIO anexado, evitando comandos inline
# frágeis no mcp.json.
# -----------------------------------------------------------------------------

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEFAULT_ENV="${ROOT_DIR}/configs/github-mcp.env"
ENV_FILE="${GITHUB_MCP_ENV_FILE:-$DEFAULT_ENV}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "[github-mcp] Arquivo de ambiente não encontrado: $ENV_FILE" >&2
  echo "Crie-o a partir de configs/github-mcp.env.example." >&2
  exit 1
fi

# shellcheck disable=SC1090
source "$ENV_FILE"

if [[ -z "${GITHUB_PERSONAL_ACCESS_TOKEN:-}" ]]; then
  echo "[github-mcp] Variável GITHUB_PERSONAL_ACCESS_TOKEN não definida no arquivo de ambiente." >&2
  exit 1
fi

exec docker run -i --rm \
  -e GITHUB_PERSONAL_ACCESS_TOKEN="$GITHUB_PERSONAL_ACCESS_TOKEN" \
  ghcr.io/github/github-mcp-server

