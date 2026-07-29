import { PrismaClient } from '../generated/prisma/client.js';

/**
 * Prisma Client Singleton
 * Prevents multiple Prisma Client instances during development (hot-reload).
 * In production, a single instance is created and reused.
 */

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
