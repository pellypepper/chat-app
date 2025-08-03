FROM node:18-alpine

WORKDIR /app

# Copy backend and install
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy frontend and install
COPY ../frontend/package*.json ../frontend/
WORKDIR /app/frontend
RUN npm install

# Copy rest of the code
WORKDIR /app
COPY . .

# Build backend
WORKDIR /app/backend
RUN npm run build

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Build server
WORKDIR /app
RUN npm run build # or npx tsc

EXPOSE 8080
CMD ["node", "dist/server.js"]