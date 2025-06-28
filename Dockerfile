# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install root, frontend, and backend dependencies
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build the frontend (this creates the .next directory)
WORKDIR /app/frontend

RUN npm run build

# Move to app root
WORKDIR /app

# Expose port
EXPOSE 8080

# Install a process manager to run both servers (frontend+backend)
RUN npm install -g concurrently

# Set environment variable for production
ENV NODE_ENV=production
# Start the backend server
CMD ["npx", "ts-node", "backend/server.ts"]