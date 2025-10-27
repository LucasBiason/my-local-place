#!/bin/bash
# Auto-start essential MyLocalPlace services

cd /home/lucas-biason/Projetos/Estudos/Projetos\ de\ Portifolio/my-local-place

echo "Starting essential MyLocalPlace services..."
docker compose start local-postgres
docker compose start dashboard

echo "Essential services started!"
echo "Dashboard: http://localhost:8501"
