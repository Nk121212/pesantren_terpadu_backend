import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // 1. Create SUPERADMIN
  const password = await bcrypt.hash("superadmin123", 10);
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@example.com" },
    update: {},
    create: {
      email: "superadmin@example.com",
      password,
      name: "Super Admin",
      role: Role.SUPERADMIN,
    },
  });

  console.log("SUPERADMIN created:", superadmin.email);

  // 2. Create sample santri
  const guardian = await prisma.user.create({
    data: {
      email: "guardian@example.com",
      password: await bcrypt.hash("guardian123", 10),
      name: "Guardian Wali",
      role: Role.GUARDIAN,
    },
  });

  const santri = await prisma.santri.create({
    data: {
      name: "Ahmad Santri",
      gender: "L",
      birthDate: new Date("2010-01-01"),
      address: "Jl. Contoh No. 1",
      guardianId: guardian.id,
    },
  });

  console.log("Santri created:", santri.name);

  // 3. Create sample invoice
  const invoice = await prisma.invoice.create({
    data: {
      santriId: santri.id,
      amount: 500000,
      description: "SPP Bulanan",
      status: "PENDING",
      dueDate: new Date(new Date().setDate(25)),
    },
  });

  console.log("Invoice created:", invoice.id);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
