// Скрипт для запуска Next.js приложения
const { spawn } = require('child_process');
const path = require('path');

// Выводим диагностическую информацию
require('./railway.js');

// Получение порта из переменных окружения или использование 3000 по умолчанию
const PORT = process.env.PORT || 3000;

console.log(`Запуск Next.js на порту ${PORT}...`);

// Пути к директориям Next.js
const nextBinPath = path.join(process.cwd(), 'node_modules', '.bin', 'next');

// Запуск Next.js
const nextProcess = spawn(nextBinPath, ['start', '-p', PORT], {
  stdio: 'inherit',
  shell: true
});

nextProcess.on('close', (code) => {
  console.log(`Next.js процесс завершился с кодом ${code}`);
  process.exit(code);
});

// Обработка сигналов завершения
process.on('SIGINT', () => {
  nextProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  nextProcess.kill('SIGTERM');
});
