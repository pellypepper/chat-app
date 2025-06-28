# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for both frontend and backend
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/
COPY package*.json ./

# Install all dependencies
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Copy next.config.js to frontend directory (where it belongs)
COPY frontend/next.config.js ./frontend/

# Build the frontend
WORKDIR /app/frontend
RUN npm run build

# Go back to app root
WORKDIR /app

# Expose port
EXPOSE 8080

# Start the backend server (which serves the frontend)
CMD ["npx", "ts-node", "backend/server.ts"]