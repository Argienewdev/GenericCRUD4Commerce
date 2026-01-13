Write-Host "[INFO] Starting DEVELOPMENT environment (Hot Reload)..." -ForegroundColor Cyan

docker-compose -f docker-compose.dev.yml down

docker-compose -f docker-compose.dev.yml up --build