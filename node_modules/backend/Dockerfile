# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory in container
WORKDIR /app

# Copy only package.json and package-lock.json (for install step)
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the backend code
COPY . .
RUN chmod +x node_modules/.bin/tsc
# Build TypeScript code (if you have a build step)
RUN npm run build

# Expose your port (adjust if not 8080)
EXPOSE 8080

# Start the server
CMD ["node", "--max-old-space-size=128", "dist/server.js"]