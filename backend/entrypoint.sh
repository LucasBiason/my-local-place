#!/usr/bin/env bash

# Exit immediately if a command exits with a non-zero status, treat unset variables as errors, and fail on pipeline errors.
set -euo pipefail

# Function to display CLI help
cli_help() {
  local cli_name=${0##*/}
  echo "
$cli_name
MyLocalPlace Backend API - Entrypoint CLI
Usage: $cli_name [command]

Commands:
  dev           Start development server (hot reload)
  runserver     Start production server (multi-worker)
  health        Check API health and Docker connectivity
  *             Display this help message

Environment Variables:
  PORT          Server port (default: 8000)
  WORKERS       Number of workers for production (default: 4)
  LOG_LEVEL     Logging level (default: info)
"
  exit 1
}

# Function to check Docker socket
check_docker() {
  if [ ! -S "/var/run/docker.sock" ]; then
    echo "WARNING: Docker socket not found at /var/run/docker.sock"
    echo "   Please ensure Docker socket is mounted"
    return 1
  fi
  echo "Docker socket found"
  return 0
}

# Main command handler
case "${1:-runserver}" in
  dev)
    echo "========================================="
    echo "MyLocalPlace Backend API - DEVELOPMENT"
    echo "========================================="
    check_docker || true
    PORT=${PORT:-8000}
    LOG_LEVEL=${LOG_LEVEL:-debug}
    
    echo "Starting development server..."
    echo "  Port: $PORT"
    echo "  Hot reload: enabled"
    echo "  Log level: $LOG_LEVEL"
    echo "========================================="
    
    exec uvicorn app.main:app \
      --host 0.0.0.0 \
      --port "$PORT" \
      --reload \
      --log-level "$LOG_LEVEL"
    ;;

  runserver)
    echo "========================================="
    echo "MyLocalPlace Backend API - PRODUCTION"
    echo "========================================="
    check_docker || exit 1
    
    PORT=${PORT:-8000}
    WORKERS=${WORKERS:-4}
    LOG_LEVEL=${LOG_LEVEL:-info}
    
    echo "Starting production server..."
    echo "  Port: $PORT"
    echo "  Workers: $WORKERS"
    echo "  Log level: $LOG_LEVEL"
    echo "========================================="
    
    exec uvicorn app.main:app \
      --host 0.0.0.0 \
      --port "$PORT" \
      --workers "$WORKERS" \
      --log-level "$LOG_LEVEL"
    ;;

  health)
    echo "========================================="
    echo "Health Check"
    echo "========================================="
    check_docker
    echo "API is ready to start"
    ;;

  *)
    cli_help
    ;;
esac

