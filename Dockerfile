# Step 1: Build frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Step 2: Set up backend
FROM node:18
WORKDIR /app

# Copy backend and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source and frontend build
COPY backend/ ./backend/
COPY --from=frontend /app/frontend/build ./backend/frontend/build

# Set environment
WORKDIR /app/backend
ENV PORT=8080
EXPOSE 8080

# Run backend (make sure it serves static files from ./frontend/build)
CMD ["node", "server.js"]
