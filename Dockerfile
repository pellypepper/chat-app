# Build frontend
FROM node:20 AS frontend
WORKDIR /app/frontend

# Copy frontend package files first (better caching)
COPY frontend/package*.json ./
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

# Copy backend source code into a subfolder
COPY backend/ ./backend/


# Copy frontend build output from previous stage
# Next.js build output is in .next and also you need to copy public folder if used by frontend
COPY --from=frontend /app/frontend/.next ./.next
COPY --from=frontend /app/frontend/public ./public
COPY --from=frontend /app/frontend/package.json ./package.json

ENV PORT=8080
EXPOSE 8080

CMD ["node", "backend/server.js"]
