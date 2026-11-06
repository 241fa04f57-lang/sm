# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package descriptors
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application source
COPY . .

# Build Vite/React production app
RUN npm run build

# Production stage
FROM nginx:alpine

# Default PORT environment variable (Render dynamically passes PORT)
ENV PORT=80

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Replace listen port with dynamic $PORT from Render and start nginx
CMD ["/bin/sh", "-c", "sed -i \"s/listen .*/listen ${PORT};/g\" /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]

