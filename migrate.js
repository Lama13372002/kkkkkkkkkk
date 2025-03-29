// Скрипт для запуска миграций при деплое
const { exec } = require('child_process');

console.log('Запуск миграций базы данных...');

exec('bunx prisma migrate deploy', (error, stdout, stderr) => {
  if (error) {
    console.error(`Ошибка выполнения миграций: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`Предупреждение: ${stderr}`);
  }

  console.log(`Миграции успешно выполнены: ${stdout}`);
});
