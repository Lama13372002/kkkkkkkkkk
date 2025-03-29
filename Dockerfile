FROM oven/bun:1 as base
WORKDIR /app

# Устанавливаем зависимости
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Копируем файлы приложения
COPY . .

# Генерируем Prisma клиент
RUN bunx prisma generate

# Сборка проекта
RUN bun run build

# Создаем скрипт запуска приложения с предварительным запуском миграций
RUN echo '#!/bin/sh\nnode migrate.js && bun start' > /app/start.sh && chmod +x /app/start.sh

# Запуск приложения
EXPOSE 3000
CMD ["/app/start.sh"]