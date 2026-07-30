import 'dotenv/config';
import prisma from '../src/config/db.js';

async function main() {
    console.log('Seeding database...');

    // Clean up existing data for a fresh start (optional, be careful in production!)
    // We are only doing this for development
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();

    // Create a test user
    const user = await prisma.user.create({
        data: {
            id: '123e4567-e89b-12d3-a456-426614174000', // Valid UUID
            fullName: 'Test User',
            email: 'test@example.com',
            passwordHash: 'dummy_hash',
        },
    });

    console.log('Created test user:', user);

    // Create a default account
    const account = await prisma.account.create({
        data: {
            userId: user.id,
            name: 'HDFC Bank',
            kind: 'bank',
            openingBalance: 50000,
        },
    });

    console.log('Created test account:', account);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
