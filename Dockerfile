# Production Dockerfile for Vite/React/Ionic SPA with nginx

# 1. Build stage
FROM node:20.11.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Nginx stage
FROM nginx:alpine
# Копируем собранный фронт в стандартную папку nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Копируем свой nginx.conf (должен быть с правильным location /a/)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
