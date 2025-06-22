# Dockerfile для frontend-контейнера (только билд и копирование статики в volume)

FROM node:20.11.1-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Копируем статику в volume, который будет использовать nginx
FROM alpine as export
WORKDIR /export
COPY --from=build /app/dist /export
CMD ["sh", "-c", "cp -r /export/* /frontend_static/"]

# Для совместимости с docker-compose (контейнер не должен завершаться мгновенно)
FROM alpine
VOLUME ["/frontend_static"]
CMD ["tail", "-f", "/dev/null"]
