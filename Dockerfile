# Build stage for the frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Main app stage
FROM node:18-alpine
WORKDIR /app

# Copy backend dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend code
COPY backend/ ./

# Create public directory and copy frontend build
RUN mkdir -p public
COPY --from=frontend-builder /app/frontend/dist/ ./public/

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the server
CMD ["node", "server.js"]