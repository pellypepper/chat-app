# Use Node.js 18 or later
FROM node:18-alpine

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy frontend package and install
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install

# Copy backend package and install
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy all source code
COPY . .

# Build only the frontend (backend will run via ts-node)
WORKDIR /app/frontend
RUN npm run build

# Build only the root server
WORKDIR /app
RUN npm run build

# Verify structure
RUN echo "=== File Structure ===" && \
    ls -la && \
    echo "=== Backend Routes ===" && \
    ls -la backend/src/routes/ && \
    echo "=== Dist ===" && \
    ls -la dist/

# Expose port
EXPOSE 8080

# Start the server (backend routes will be loaded via ts-node/require)
CMD ["node", "dist/server.js"]