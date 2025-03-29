FROM oven/bun:1 as base
WORKDIR /app

# Копируем только файлы, необходимые для зависимостей
COPY package.json bun.lock ./
COPY prisma ./prisma

# Устанавливаем зависимости
RUN bun install

# Копируем остальные файлы приложения
COPY . .

# Генерируем Prisma клиент (на всякий случай, хотя он должен был сгенерироваться в postinstall)
RUN bunx prisma generate

# Сборка проекта
RUN bun run build

# Создаем скрипт запуска приложения с предварительным запуском миграций
RUN echo '#!/bin/sh\nnode migrate.js && bun start' > /app/start.sh && chmod +x /app/start.sh

# Запуск приложения
EXPOSE 3000
CMD ["/app/start.sh"]