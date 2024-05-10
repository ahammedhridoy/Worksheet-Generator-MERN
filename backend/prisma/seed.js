const prisma = require("../utils/prismaClient");
const bcrypt = require("bcryptjs");

async function seedAdminUser() {
  const adminEmail = "admin@admin.com";

  // Check if the admin user already exists
  const adminExists = await prisma.user.findUnique({
    where: {
      email: adminEmail,
    },
  });

  if (!adminExists) {
    // Create the admin user if they don't exist
    const user = await prisma.user.create({
      data: {
        email: adminEmail,
        username: "admin",
        password: await bcrypt.hash("admin", 10),
        role: "ADMIN",
      },
    });
    console.log("Admin user created:", user);
  } else {
    console.log("Admin user already exists");
  }
}

async function main() {
  await seedAdminUser();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
