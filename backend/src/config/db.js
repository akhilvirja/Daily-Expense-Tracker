import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Prisma Client Singleton
 * Prevents multiple Prisma Client instances during development (hot-reload).
 * In production, a single instance is created and reused.
 *
 * Prisma 7 requires an explicit driver adapter for database connections.
 */

const globalForPrisma = globalThis;

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

const prisma = globalForPrisma.prisma ?? new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;
