import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const menuData = [
  {
    name: "Dashboard",
    icon: "Home",
    path: "/dashboard",
    order: 1,
    isActive: true,
  },
  {
    name: "Santri",
    icon: "Users",
    path: "/santri",
    order: 2,
    isActive: true,
  },
  {
    name: "Tagihan",
    icon: "DollarSign",
    path: "/tagihan",
    order: 3,
    isActive: true,
  },
  {
    name: "Tabungan",
    icon: "PiggyBank",
    path: "/tabungan",
    order: 4,
    isActive: true,
  },
  {
    name: "Keuangan",
    icon: "DollarSign",
    path: "/finance",
    order: 5,
    isActive: true,
  },
  {
    name: "PPDB",
    icon: "FileText",
    path: "/ppdb",
    order: 6,
    isActive: true,
  },
  {
    name: "Kantin",
    icon: "CookingPot",
    path: "/kantin",
    order: 7,
    isActive: true,
  },
  {
    name: "Audit Trail",
    icon: "History",
    path: "/audit",
    order: 8,
    isActive: true,
  },
  {
    name: "Akademik",
    icon: "GraduationCap",
    path: null, // Parent menu tidak punya path langsung
    order: 9,
    isActive: true,
    children: [
      {
        name: "Dashboard Akademik",
        icon: null,
        path: "/academic",
        order: 1,
        isActive: true,
      },
      {
        name: "Mata Pelajaran",
        icon: null,
        path: "/academic/subjects",
        order: 2,
        isActive: true,
      },
      {
        name: "Nilai & Rapor",
        icon: null,
        path: "/academic/grades",
        order: 3,
        isActive: true,
      },
      {
        name: "Absensi",
        icon: null,
        path: "/academic/attendance",
        order: 4,
        isActive: true,
      },
    ],
  },
  {
    name: "Konseling",
    icon: "Users",
    path: "/counseling",
    order: 10,
    isActive: true,
  },
  {
    name: "Tahfidz",
    icon: "Book",
    path: "/tahfidz",
    order: 11,
    isActive: true,
  },
];

async function seedMenus() {
  try {
    console.log("🌱 Seeding menu data...");

    // Hapus semua data menu yang ada (opsional)
    await prisma.menu.deleteMany({});
    console.log("🗑️  Old menu data cleared");

    // Insert menu utama (parent)
    for (const menuItem of menuData) {
      if (!menuItem.children) {
        // Insert menu tanpa children
        await prisma.menu.create({
          data: {
            name: menuItem.name,
            icon: menuItem.icon,
            path: menuItem.path,
            order: menuItem.order,
            isActive: menuItem.isActive,
          },
        });
        console.log(`✅ Created menu: ${menuItem.name}`);
      }
    }

    // Insert menu dengan children (parent dulu, lalu children)
    for (const parentItem of menuData.filter((item) => item.children)) {
      // Insert parent menu
      const parentMenu = await prisma.menu.create({
        data: {
          name: parentItem.name,
          icon: parentItem.icon,
          path: parentItem.path,
          order: parentItem.order,
          isActive: parentItem.isActive,
        },
      });
      console.log(`✅ Created parent menu: ${parentItem.name}`);

      // Insert children menus
      if (parentItem.children) {
        for (const childItem of parentItem.children) {
          await prisma.menu.create({
            data: {
              name: childItem.name,
              icon: childItem.icon,
              path: childItem.path,
              order: childItem.order,
              isActive: childItem.isActive,
              parentId: parentMenu.id,
            },
          });
          console.log(`  ↪️ Created child menu: ${childItem.name}`);
        }
      }
    }

    console.log("🎉 Menu seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding menus:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Jalankan seed
seedMenus();
