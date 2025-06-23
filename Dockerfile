FROM node:20.11.1-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install serve -g

COPY . .
RUN npm run build

EXPOSE 3000

# Создаем скрипт для выполнения обеих команд
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'cp -r /app/dist/. /frontend_static/' >> /start.sh && \
    echo 'npm run serve' >> /start.sh && \
    chmod +x /start.sh

CMD ["/start.sh"]
