FROM node:20.11.1-alpine as build

WORKDIR /app

# Копируем package files и устанавливаем зависимости
COPY package*.json ./
RUN npm install

# Копируем исходный код и собираем
COPY . .
RUN npm run build

# Используем минимальный образ для хранения статических файлов
FROM alpine:latest

WORKDIR /app

# Копируем собранные файлы
COPY --from=build /app/dist ./

# Создаем пользователя для безопасности
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Меняем владельца файлов
RUN chown -R nextjs:nodejs /app
USER nextjs

# Эта команда просто держит контейнер запущенным
CMD ["tail", "-f", "/dev/null"]
