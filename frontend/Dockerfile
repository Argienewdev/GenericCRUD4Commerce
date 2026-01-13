# --- ETAPA 1: BUILD ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copiamos primero los manifiestos para aprovechar el caché de capas de Docker
COPY package*.json ./
RUN npm ci

# Copiamos el resto del código y construimos
COPY . .
RUN npm run build
# Nota: Vite/SWC por defecto genera la salida en la carpeta 'dist'

# --- ETAPA 2: PRODUCTION ---
FROM nginx:alpine AS production

# Copiamos la configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiamos los archivos compilados desde la etapa anterior
# Ajusta 'dist' si tu configuración de build usa otra carpeta (ej: 'build')
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]