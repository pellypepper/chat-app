# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies (including dev dependencies for build)
RUN npm install
RUN cd frontend && npm ci
RUN cd backend && npm ci

# Copy source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build the backend TypeScript
WORKDIR /app/backend
RUN npm run build

# Clean up dev dependencies after build
RUN npm prune --production

# Build the frontend (this creates the .next directory)
WORKDIR /app/frontend
RUN npm run build

# Verify .next directory was created
RUN ls -la .next/ || echo "❌ .next directory not found!"

# Clean up dev dependencies after build
RUN npm prune --production

# Move back to app root
WORKDIR /app

# Expose port
EXPOSE 8080

# Set environment variable for production
ENV NODE_ENV=production

# Start the backend server (which should serve the frontend)
CMD ["node", "backend/dist/server.js"]