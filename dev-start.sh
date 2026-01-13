#!/usr/bin/env bash
set -e

echo "[INFO] Starting DEVELOPMENT environment (Hot Reload)..."

docker compose -f docker-compose.dev.yml down

docker compose -f docker-compose.dev.yml up --build
