Write-Host "[INFO] Starting PRODUCTION environment..." -ForegroundColor Green

docker-compose -f docker-compose.prod.yml down

docker-compose -f docker-compose.prod.yml up -d --build

Write-Host "Production environment is up and running." -ForegroundColor Green
