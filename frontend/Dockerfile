# -------------------- STAGE 1: BUILD --------------------
# Use Node.js to build the frontend assets
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency manifests first to leverage Docker cache
COPY package*.json ./

# Install dependencies using clean install
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the production-ready static files
# Vite outputs them to the "dist" folder by default
RUN npm run build

# -------------------- STAGE 2: PRODUCTION --------------------
# Use a minimal Nginx image to serve static files
FROM nginx:alpine AS production

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the compiled frontend from the build stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Run Nginx in foreground mode
CMD ["nginx", "-g", "daemon off;"]
