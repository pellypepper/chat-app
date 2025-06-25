# Build frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Setup backend
FROM node:18
WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source code
COPY backend/ ./backend/

# Copy frontend build output into backend folder for static serving
COPY --from=frontend /app/frontend/build ./backend/frontend/build

# Set backend working directory
WORKDIR /app/backend

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]
