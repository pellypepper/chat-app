FROM node:20-alpine

WORKDIR /app

# Copy package.json files first
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

# Delete any existing lock files to avoid sync issues
RUN rm -f package-lock.json backend/package-lock.json frontend/package-lock.json

# Install root dependencies first to establish version resolutions
RUN npm install --no-package-lock

# Install backend dependencies
WORKDIR /app/backend
RUN npm install --no-package-lock

# Install frontend dependencies  
WORKDIR /app/frontend
RUN npm install --no-package-lock

# Go back to root
WORKDIR /app

# Copy source code
COPY . .

# Build backend first
WORKDIR /app/backend
RUN npm run build

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Build server (from root)
WORKDIR /app
RUN npm run build:server

# Copy source code
COPY . .

# Build backend first
WORKDIR /app/backend
RUN npm run build

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Build server (from root)
WORKDIR /app
RUN npm run build:server

# Debug: List contents to verify build
RUN echo "=== Root directory ===" && ls -la
RUN echo "=== Backend dist ===" && ls -la backend/dist/ || echo "backend/dist not found"
RUN echo "=== Backend dist config ===" && ls -la backend/dist/config/ || echo "backend/dist/config not found"
RUN echo "=== Frontend .next ===" && ls -la frontend/.next/ || echo "frontend/.next not found"

EXPOSE 8080

CMD ["node", "dist/server.js"]