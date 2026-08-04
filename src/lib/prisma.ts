import { PrismaClient } from '../generated/prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: unknown };

const prismaClient = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
} as never);

export const prisma = (globalForPrisma.prisma as PrismaClient | undefined) ?? prismaClient;

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
