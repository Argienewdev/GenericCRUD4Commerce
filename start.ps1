# start.ps1

Write-Host "Iniciando despliegue de la aplicacion Fullstack..." -ForegroundColor Green

# 1. Bajar contenedores existentes
Write-Host "Deteniendo contenedores anteriores..." -ForegroundColor Green
docker-compose down

# 2. Construir y levantar
Write-Host "Construyendo imagenes y levantando servicios..." -ForegroundColor Green
docker-compose up --build -d

Write-Host "Despliegue completado!" -ForegroundColor Green
Write-Host "   - Frontend: http://localhost"
Write-Host "   - Backend:  http://localhost:8080/q/swagger-ui"
Write-Host "   - DB Port:  5432"

# 3. Mostrar logs del backend automaticamente
Write-Host "Mostrando logs del Backend (Presiona Ctrl + C para salir)..." -ForegroundColor Cyan
docker logs -f app_backend