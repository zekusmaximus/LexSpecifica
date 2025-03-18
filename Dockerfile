# Use Node.js as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files 
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy application code
COPY . .

# Build the frontend with Vite
RUN cd frontend && npm run build

# Setup static file serving for frontend build
RUN mkdir -p /app/backend/public
RUN cp -r /app/frontend/dist/* /app/backend/public/

# Set environment variable for production
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the application
CMD ["node", "backend/server.js"]