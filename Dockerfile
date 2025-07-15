FROM node:18-alpine

WORKDIR /app

# Copy package.json files
COPY package*.json ./
COPY frontend/package*.json ./frontend/
COPY backend/package*.json ./backend/

# Install root dependencies
RUN npm install

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm install

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install missing dependencies
RUN npm install geoip-lite jsonwebtoken multer nodemailer
RUN npm install --save-dev @types/geoip-lite @types/jsonwebtoken @types/multer @types/nodemailer

# Go back to frontend and install missing UI dependencies
WORKDIR /app/frontend
RUN npm install lucide-react @heroicons/react react-icons

# Copy source code
WORKDIR /app
COPY . .

# Build backend first
WORKDIR /app/backend
RUN npm run build

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Build root server
WORKDIR /app
RUN npm run build

EXPOSE 8080

CMD ["node", "dist/server.js"]