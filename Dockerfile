FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

# Copy package files for all projects
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install dependencies
RUN npm ci && npm cache clean --force
RUN cd frontend && npm ci && npm cache clean --force
RUN cd backend && npm ci && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules

# Copy all source code
COPY . .

# Build backend first
RUN cd backend && npm run build

# Build frontend (Next.js)
ENV NEXT_TELEMETRY_DISABLED 1
RUN cd frontend && npm run build

# Build root server.ts
RUN npm run build:server

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PORT 8080
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built backend
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/backend/node_modules ./backend/node_modules
COPY --from=builder /app/backend/package.json ./backend/package.json

# Copy built frontend
COPY --from=builder /app/frontend/public ./frontend/public
COPY --from=builder /app/frontend/.next/standalone ./frontend/
COPY --from=builder /app/frontend/.next/static ./frontend/.next/static

# Copy built root server.js
COPY --from=builder /app/dist/server.js ./dist/server.js

# Copy any additional files needed
COPY --from=builder /app/package.json ./package.json

USER nextjs

EXPOSE 8080

# Start the compiled server.js from the root dist directory
CMD ["node", "dist/server.js"]