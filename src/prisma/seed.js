const { PrismaClient } = require("./app/generated/prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";

  const existingUser = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingUser) {
    console.log(`Admin user with email ${adminEmail} already exists. Skipping seed.`);
    return;
  }

  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "securepassword123",
    10
  );

  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      name: process.env.ADMIN_NAME || "Admin User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("Created admin user:", adminUser.email);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });