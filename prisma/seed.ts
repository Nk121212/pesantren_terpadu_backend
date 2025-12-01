import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: { email: "superadmin@pesantren.com" },
  });
  if (!existing) {
    const password = await bcrypt.hash("admin123", 10);
    await prisma.user.create({
      data: {
        email: "superadmin@pesantren.com",
        password,
        name: "Super Admin",
        role: "SUPERADMIN",
      },
    });
    console.log("Seeded superadmin@pesantren.com / admin123");
  } else {
    console.log("Admin already exists");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
