import { PrismaClient, Role } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function createUsers() {
  const password = await bcrypt.hash("password123", 10);

  const usersData = [
    {
      email: "superadmin@pondok.com",
      password,
      name: "Super Admin Utama",
      role: Role.SUPERADMIN,
    },
    {
      email: "admin1@pondok.com",
      password,
      name: "Admin Keuangan",
      role: Role.ADMIN,
    },
    {
      email: "admin2@pondok.com",
      password,
      name: "Admin Akademik",
      role: Role.ADMIN,
    },
    {
      email: "staff1@pondok.com",
      password,
      name: "Staff Administrasi",
      role: Role.STAFF,
    },
    {
      email: "staff2@pondok.com",
      password,
      name: "Staff PPDB",
      role: Role.STAFF,
    },
    {
      email: "staff3@pondok.com",
      password,
      name: "Staff Kesiswaan",
      role: Role.STAFF,
    },
    {
      email: "ustadz1@pondok.com",
      password,
      name: "Ustadz Muhammad",
      role: Role.TEACHER,
    },
    {
      email: "ustadz2@pondok.com",
      password,
      name: "Ustadz Abdul",
      role: Role.TEACHER,
    },
    {
      email: "ustadz3@pondok.com",
      password,
      name: "Ustadzah Fatimah",
      role: Role.TEACHER,
    },
    {
      email: "santri1@pondok.com",
      password,
      name: "Santri Ahmad",
      role: Role.STUDENT,
    },
    {
      email: "santri2@pondok.com",
      password,
      name: "Santri Ali",
      role: Role.STUDENT,
    },
    {
      email: "santri3@pondok.com",
      password,
      name: "Santri Hasan",
      role: Role.STUDENT,
    },
    {
      email: "santri4@pondok.com",
      password,
      name: "Santri Zainab",
      role: Role.STUDENT,
    },
    {
      email: "santri5@pondok.com",
      password,
      name: "Santri Maryam",
      role: Role.STUDENT,
    },
    {
      email: "wali1@pondok.com",
      password,
      name: "Wali Santri 1",
      role: Role.GUARDIAN,
    },
    {
      email: "wali2@pondok.com",
      password,
      name: "Wali Santri 2",
      role: Role.GUARDIAN,
    },
    {
      email: "wali3@pondok.com",
      password,
      name: "Wali Santri 3",
      role: Role.GUARDIAN,
    },
    {
      email: "wali4@pondok.com",
      password,
      name: "Wali Santri 4",
      role: Role.GUARDIAN,
    },
    {
      email: "wali5@pondok.com",
      password,
      name: "Wali Santri 5",
      role: Role.GUARDIAN,
    },
    {
      email: "kantin1@pondok.com",
      password,
      name: "Pemilik Kantin A",
      role: Role.MERCHANT,
    },
    {
      email: "kantin2@pondok.com",
      password,
      name: "Pemilik Kantin B",
      role: Role.MERCHANT,
    },
  ];

  const createdUsers = [];
  for (const userData of usersData) {
    const user = await prisma.user.create({
      data: userData,
    });
    createdUsers.push(user);
    console.log(`Created user: ${user.email} (${user.role})`);
  }

  return createdUsers;
}

async function createSantriData(guardians: any[]) {
  const santriData = [
    {
      name: "Ahmad Santoso",
      gender: "L",
      birthDate: new Date("2010-05-15"),
      address: "Jl. Merdeka No. 1",
    },
    {
      name: "Siti Nurhaliza",
      gender: "P",
      birthDate: new Date("2011-03-20"),
      address: "Jl. Sudirman No. 2",
    },
    {
      name: "Muhammad Ali",
      gender: "L",
      birthDate: new Date("2009-11-10"),
      address: "Jl. Diponegoro No. 3",
    },
    {
      name: "Fatimah Azzahra",
      gender: "P",
      birthDate: new Date("2010-08-25"),
      address: "Jl. Gatot Subroto No. 4",
    },
    {
      name: "Abdul Rahman",
      gender: "L",
      birthDate: new Date("2011-01-30"),
      address: "Jl. Thamrin No. 5",
    },
  ];

  const createdSantri = [];
  for (let i = 0; i < santriData.length; i++) {
    const santri = await prisma.santri.create({
      data: {
        ...santriData[i],
        guardianId: guardians[i]?.id,
      },
    });
    createdSantri.push(santri);
    console.log(`Created santri: ${santri.name}`);
  }

  return createdSantri;
}

async function createMerchantData(merchantUsers: any[]) {
  for (const user of merchantUsers) {
    if (user.role === Role.MERCHANT) {
      await prisma.merchant.create({
        data: {
          userId: user.id,
          name: `${user.name}'s Store`,
          balance: 10000000,
        },
      });
      console.log(`Created merchant for: ${user.name}`);
    }
  }
}

async function main() {
  console.log("Starting seed...");

  const users = await createUsers();
  const guardians = users.filter((user) => user.role === Role.GUARDIAN);

  await createSantriData(guardians);

  const merchantUsers = users.filter((user) => user.role === Role.MERCHANT);
  await createMerchantData(merchantUsers);

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
