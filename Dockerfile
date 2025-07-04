# Build container
FROM node:18-alpine

WORKDIR /app

# Copy and install root deps
COPY package*.json ./
RUN npm install

# Copy backend and install backend deps
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy all source code
COPY . .

# Build backend (outputs to /backend/dist)
RUN cd backend && npm run build

# Copy backend build to root dist (optional, if needed)
RUN mkdir -p dist && cp backend/dist/* dist/

# Build frontend (if needed)
WORKDIR /app/frontend
RUN npm install
RUN npm run build

WORKDIR /app

EXPOSE 8080
CMD ["node", "dist/server.js"]