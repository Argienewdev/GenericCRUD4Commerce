# dev.ps1
Write-Host "Iniciando Entorno de DESARROLLO (Hot Reload)..." -ForegroundColor Cyan

# Bajamos cualquier cosa que esté corriendo (Prod o Dev)
docker-compose down
docker-compose -f docker-compose.dev.yml down

# Levantamos usando el archivo DEV
docker-compose -f docker-compose.dev.yml up --build