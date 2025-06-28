# Use Node.js 18 LTS
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm install
RUN cd frontend && npm install
RUN cd backend && npm install

# Copy source code
COPY frontend/ ./frontend/
COPY backend/ ./backend/

# Build the frontend (this creates the .next directory)
WORKDIR /app/frontend

# Debug: Show what's in the frontend directory before build
RUN echo "📁 Contents of frontend directory before build:" && ls -la

# Run the build with verbose output
RUN npm run build

# Debug: Show what's in the frontend directory after build
RUN echo "📁 Contents of frontend directory after build:" && ls -la

# Verify the build was successful
RUN ls -la .next || (echo "❌ .next directory not found after build!" && exit 1)

# Show .next contents
RUN echo "📁 Contents of .next directory:" && ls -la .next

# Go back to app root
WORKDIR /app

# Expose port
EXPOSE 8080

# Start the backend server
CMD ["npx", "ts-node", "backend/server.ts"]