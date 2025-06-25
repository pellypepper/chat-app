# Build frontend
FROM node:20 AS frontend
WORKDIR /app

# Copy frontend package files first (better caching)
COPY frontend/package*.json ./frontend/
WORKDIR /app/frontend
RUN npm install

# Copy frontend source and build
COPY frontend/ ./
RUN npm run build

# Build backend
FROM node:18 AS backend
WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm install

# Copy backend source code
COPY backend/ ./

# Copy frontend build output from previous stage
COPY --from=frontend /app/frontend/build ./frontend/build

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]