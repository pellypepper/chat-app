FROM node:18-alpine

WORKDIR /app

# Copy and install root dependencies
COPY package*.json ./
RUN npm install

# Copy backend and build
COPY backend ./backend
WORKDIR /app/backend
RUN npm install && npm run build # outputs to /app/backend/dist

# Copy server.ts and build
WORKDIR /app
COPY tsconfig.server.json ./
COPY server.ts ./
RUN npx tsc -p tsconfig.server.json # outputs to /app/dist/server.js

# Copy frontend and build
COPY frontend ./frontend
WORKDIR /app/frontend
RUN npm install && npm run build # outputs to /app/frontend/.next

# Go back to main app directory for runtime
WORKDIR /app

EXPOSE 8080

CMD ["node", "dist/server.js"]