# Use Node.js 18 or later
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

# Copy source code
COPY . .

# Build the frontend
WORKDIR /app/frontend
RUN npm run build

# Build the backend
WORKDIR /app/backend
RUN npm run build

# Set working directory back to root
# Build the root server (after backend)
WORKDIR /app
RUN npm run build

# Expose port
EXPOSE 8080

# Start the server
CMD ["node", "dist/server.js"]