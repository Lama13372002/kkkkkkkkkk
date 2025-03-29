'use client'

import { PrismaClient } from '@prisma/client'

// Глобальная переменная для поддержки единственного экземпляра
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Предотвращаем создание множества экземпляров Prisma Client в режиме разработки
// при использовании горячей перезагрузки

const prismaClientSingleton = () => {
  return new PrismaClient()
}

export const prisma = globalThis.prisma ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma

export const getPrismaClient = () => {
  return prisma
}
