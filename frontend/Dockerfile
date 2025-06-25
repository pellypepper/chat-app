# Build the React app
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Serve with NGINX
FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html

# Optional: custom NGINX config
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
