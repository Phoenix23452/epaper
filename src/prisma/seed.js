// prisma/seed.js

const { prisma } = require('@/lib/prisma');
const UserRepository = require('@/repos/UserRepository');

async function main() {
  const userRepo = new UserRepository();

  // Check if admin user already exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const existingUser = await userRepo.findByEmail(adminEmail);
  if (existingUser) {
    console.log(
      `Admin user with email ${adminEmail} already exists. Skipping seed.`
    );
    return;
  }

  // Create admin user
  const adminUser = await userRepo.create({
    email: adminEmail,
    name: process.env.ADMIN_NAME || 'Admin User',
    password: process.env.ADMIN_PASSWORD || 'securepassword123', // Change in production
    role: 'ADMIN',
  });
  console.log('Created admin user:', adminUser.email);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
