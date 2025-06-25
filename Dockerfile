# Build frontend
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY ./frontend/package*.json ./
RUN npm install
COPY ./frontend/ ./
RUN npm run build

# Build backend
FROM node:18
WORKDIR /app/backend

# Copy backend package files and install dependencies
COPY ./backend/package*.json ./
RUN npm install

# Copy backend source code
COPY ./backend/ ./

# Copy frontend build output into backend for static serving
COPY --from=frontend /app/frontend/build ./frontend/build

ENV PORT=8080
EXPOSE 8080

CMD ["node", "server.js"]