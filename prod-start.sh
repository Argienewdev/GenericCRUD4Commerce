#!/usr/bin/env bash
set -e

echo "[INFO] Starting PRODUCTION environment..."

docker compose -f docker-compose.prod.yml down

docker compose -f docker-compose.prod.yml up -d --build
