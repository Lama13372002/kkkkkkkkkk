import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/settings - Получение всех настроек сайта
export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany()

    // Преобразуем массив в объект для удобства использования
    const settingsObject = settings.reduce((acc, item) => {
      acc[item.key] = item.value
      return acc
    }, {} as Record<string, string>)

    return NextResponse.json(settingsObject)
  } catch (error) {
    console.error('Ошибка при получении настроек:', error)
    return NextResponse.json({ error: 'Не удалось получить настройки' }, { status: 500 })
  }
}

// Список разрешенных ключей для обновления (только настройки подвала)
const allowedFooterKeys = [
  'footer_company_address',
  'footer_company_phone',
  'footer_company_email',
  'footer_working_hours',
  'footer_social_instagram',
  'footer_social_telegram',
  'footer_social_whatsapp',
  'footer_company_description'
]

// POST /api/settings - Обновление настроек сайта
export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Валидация данных
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Неверный формат данных' }, { status: 400 })
    }

    // Обновляем только разрешенные ключи
    const updatePromises = Object.entries(data)
      .filter(([key]) => allowedFooterKeys.includes(key))
      .map(async ([key, value]) => {
        // Проверяем, что значение - строка
        if (typeof value !== 'string') {
          throw new Error(`Значение для ключа ${key} должно быть строкой`)
        }

        return prisma.siteSettings.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      })

    await Promise.all(updatePromises)

    return NextResponse.json({ success: true, message: 'Настройки успешно обновлены' })
  } catch (error) {
    console.error('Ошибка при обновлении настроек:', error)
    return NextResponse.json({ error: 'Не удалось обновить настройки' }, { status: 500 })
  }
}
