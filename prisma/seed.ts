// seed.ts
import {
  PrismaClient,
  Role,
  InvoiceStatus,
  PaymentMethod,
  PaymentStatus,
  TransactionType,
  TransactionStatus,
  PpdbStatus,
} from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // Hash password default untuk semua user
  const defaultPassword = await bcrypt.hash("password123", 10);

  // ============================================
  // 1. Seed Menu (16 data)
  // ============================================
  console.log("Seeding Menu data...");

  const menus = [
    // Menu utama tanpa parent
    {
      id: 9,
      parentId: null,
      name: "Dashboard",
      icon: "Home",
      path: "/dashboard",
      order: 1,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 10,
      parentId: null,
      name: "Santri",
      icon: "Users",
      path: "/santri",
      order: 2,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 11,
      parentId: null,
      name: "Tagihan",
      icon: "DollarSign",
      path: "/tagihan",
      order: 3,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 12,
      parentId: null,
      name: "Tabungan",
      icon: "PiggyBank",
      path: "/tabungan",
      order: 4,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 13,
      parentId: null,
      name: "Keuangan",
      icon: "DollarSign",
      path: "/finance",
      order: 5,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 14,
      parentId: null,
      name: "PPDB",
      icon: "FileText",
      path: "/ppdb",
      order: 6,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 15,
      parentId: null,
      name: "Kantin",
      icon: "CookingPot",
      path: "/kantin",
      order: 7,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 16,
      parentId: null,
      name: "Audit Trail",
      icon: "History",
      path: "/audit",
      order: 8,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 17,
      parentId: null,
      name: "Akademik",
      icon: "GraduationCap",
      path: null,
      order: 9,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 18,
      parentId: null,
      name: "Konseling",
      icon: "Users",
      path: "/counseling",
      order: 10,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 19,
      parentId: null,
      name: "Tahfidz",
      icon: "Book",
      path: "/tahfidz",
      order: 11,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.586Z"),
      updatedAt: new Date("2025-12-17T15:11:35.586Z"),
    },
    {
      id: 24,
      parentId: null,
      name: "Akses Menu",
      icon: "Settings",
      path: "/menu",
      order: 99,
      isActive: true,
      createdAt: new Date("2025-12-17T15:36:23Z"),
      updatedAt: new Date("2025-12-17T15:36:28Z"),
    },
    // Submenu Akademik (parentId: 17)
    {
      id: 20,
      parentId: 17,
      name: "Dashboard Akademik",
      icon: null,
      path: "/academic",
      order: 1,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.592Z"),
      updatedAt: new Date("2025-12-17T15:11:35.592Z"),
    },
    {
      id: 21,
      parentId: 17,
      name: "Mata Pelajaran",
      icon: null,
      path: "/academic/subjects",
      order: 2,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.592Z"),
      updatedAt: new Date("2025-12-17T15:11:35.592Z"),
    },
    {
      id: 22,
      parentId: 17,
      name: "Nilai & Rapor",
      icon: null,
      path: "/academic/grades",
      order: 3,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.592Z"),
      updatedAt: new Date("2025-12-17T15:11:35.592Z"),
    },
    {
      id: 23,
      parentId: 17,
      name: "Absensi",
      icon: null,
      path: "/academic/attendance",
      order: 4,
      isActive: true,
      createdAt: new Date("2025-12-17T15:11:35.592Z"),
      updatedAt: new Date("2025-12-17T15:11:35.592Z"),
    },
  ];

  for (const menu of menus) {
    await prisma.menu.upsert({
      where: { id: menu.id },
      update: {
        parentId: menu.parentId,
        name: menu.name,
        icon: menu.icon,
        path: menu.path,
        order: menu.order,
        isActive: menu.isActive,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
      },
      create: {
        id: menu.id,
        parentId: menu.parentId,
        name: menu.name,
        icon: menu.icon,
        path: menu.path,
        order: menu.order,
        isActive: menu.isActive,
        createdAt: menu.createdAt,
        updatedAt: menu.updatedAt,
      },
    });
  }

  // ============================================
  // 2. Seed User (22 data) dengan password bcrypt
  // ============================================
  console.log("Seeding User data...");

  const users = [
    {
      id: 1,
      email: "superadmin@pesantren.com",
      password: defaultPassword,
      name: "Super Admin",
      role: Role.SUPERADMIN,
      createdAt: new Date("2025-11-12T04:14:47.916Z"),
    },
    {
      id: 2,
      email: "superadmin@pondok.com",
      password: defaultPassword,
      name: "Super Admin Utama",
      role: Role.SUPERADMIN,
      createdAt: new Date("2025-12-02T04:51:23.191Z"),
    },
    {
      id: 3,
      email: "admin1@pondok.com",
      password: defaultPassword,
      name: "Admin Keuangan",
      role: Role.ADMIN,
      createdAt: new Date("2025-12-02T04:51:23.274Z"),
    },
    {
      id: 4,
      email: "admin2@pondok.com",
      password: defaultPassword,
      name: "Admin Akademik",
      role: Role.ADMIN,
      createdAt: new Date("2025-12-02T04:51:23.279Z"),
    },
    {
      id: 5,
      email: "staff1@pondok.com",
      password: defaultPassword,
      name: "Staff Administrasi",
      role: Role.STAFF,
      createdAt: new Date("2025-12-02T04:51:23.282Z"),
    },
    {
      id: 6,
      email: "staff2@pondok.com",
      password: defaultPassword,
      name: "Staff PPDB",
      role: Role.STAFF,
      createdAt: new Date("2025-12-02T04:51:23.286Z"),
    },
    {
      id: 7,
      email: "staff3@pondok.com",
      password: defaultPassword,
      name: "Staff Kesiswaan",
      role: Role.STAFF,
      createdAt: new Date("2025-12-02T04:51:23.288Z"),
    },
    {
      id: 8,
      email: "ustadz1@pondok.com",
      password: defaultPassword,
      name: "Ustadz Muhammad",
      role: Role.TEACHER,
      createdAt: new Date("2025-12-02T04:51:23.292Z"),
    },
    {
      id: 9,
      email: "ustadz2@pondok.com",
      password: defaultPassword,
      name: "Ustadz Abdul",
      role: Role.TEACHER,
      createdAt: new Date("2025-12-02T04:51:23.297Z"),
    },
    {
      id: 10,
      email: "ustadz3@pondok.com",
      password: defaultPassword,
      name: "Ustadzah Fatimah",
      role: Role.TEACHER,
      createdAt: new Date("2025-12-02T04:51:23.301Z"),
    },
    {
      id: 11,
      email: "santri1@pondok.com",
      password: defaultPassword,
      name: "Santri Ahmad",
      role: Role.STUDENT,
      createdAt: new Date("2025-12-02T04:51:23.305Z"),
    },
    {
      id: 12,
      email: "santri2@pondok.com",
      password: defaultPassword,
      name: "Santri Ali",
      role: Role.STUDENT,
      createdAt: new Date("2025-12-02T04:51:23.307Z"),
    },
    {
      id: 13,
      email: "santri3@pondok.com",
      password: defaultPassword,
      name: "Santri Hasan",
      role: Role.STUDENT,
      createdAt: new Date("2025-12-02T04:51:23.310Z"),
    },
    {
      id: 14,
      email: "santri4@pondok.com",
      password: defaultPassword,
      name: "Santri Zainab",
      role: Role.STUDENT,
      createdAt: new Date("2025-12-02T04:51:23.313Z"),
    },
    {
      id: 15,
      email: "santri5@pondok.com",
      password: defaultPassword,
      name: "Santri Maryam",
      role: Role.STUDENT,
      createdAt: new Date("2025-12-02T04:51:23.315Z"),
    },
    {
      id: 16,
      email: "wali1@pondok.com",
      password: defaultPassword,
      name: "Wali Santri 1",
      role: Role.GUARDIAN,
      createdAt: new Date("2025-12-02T04:51:23.318Z"),
    },
    {
      id: 17,
      email: "wali2@pondok.com",
      password: defaultPassword,
      name: "Wali Santri 2",
      role: Role.GUARDIAN,
      createdAt: new Date("2025-12-02T04:51:23.320Z"),
    },
    {
      id: 18,
      email: "wali3@pondok.com",
      password: defaultPassword,
      name: "Wali Santri 3",
      role: Role.GUARDIAN,
      createdAt: new Date("2025-12-02T04:51:23.323Z"),
    },
    {
      id: 19,
      email: "wali4@pondok.com",
      password: defaultPassword,
      name: "Wali Santri 4",
      role: Role.GUARDIAN,
      createdAt: new Date("2025-12-02T04:51:23.325Z"),
    },
    {
      id: 20,
      email: "wali5@pondok.com",
      password: defaultPassword,
      name: "Wali Santri 5",
      role: Role.GUARDIAN,
      createdAt: new Date("2025-12-02T04:51:23.328Z"),
    },
    {
      id: 21,
      email: "kantin1@pondok.com",
      password: defaultPassword,
      name: "Pemilik Kantin A",
      role: Role.MERCHANT,
      createdAt: new Date("2025-12-02T04:51:23.331Z"),
    },
    {
      id: 22,
      email: "kantin2@pondok.com",
      password: defaultPassword,
      name: "Pemilik Kantin B",
      role: Role.MERCHANT,
      createdAt: new Date("2025-12-02T04:51:23.334Z"),
    },
  ];

  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
      create: {
        id: user.id,
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  }

  // ============================================
  // 3. Seed Santri (6 data)
  // ============================================
  console.log("Seeding Santri data...");

  const santri = [
    {
      id: 6,
      guardianId: 17,
      name: "Siti Nurhaliza",
      gender: "P",
      birthDate: new Date("2011-03-20"),
      address: "Jl. Sudirman No. 2",
      createdAt: new Date("2025-12-02T04:51:23.365Z"),
      updatedAt: new Date("2025-12-02T04:51:23.365Z"),
    },
    {
      id: 7,
      guardianId: 18,
      name: "Muhammad Ali",
      gender: "L",
      birthDate: new Date("2009-11-10"),
      address: "Jl. Diponegoro No. 3",
      createdAt: new Date("2025-12-02T04:51:23.368Z"),
      updatedAt: new Date("2025-12-02T04:51:23.368Z"),
    },
    {
      id: 8,
      guardianId: 19,
      name: "Fatimah Azzahra",
      gender: "P",
      birthDate: new Date("2010-08-25"),
      address: "Jl. Gatot Subroto No. 4",
      createdAt: new Date("2025-12-02T04:51:23.371Z"),
      updatedAt: new Date("2025-12-02T04:51:23.371Z"),
    },
    {
      id: 9,
      guardianId: 20,
      name: "Abdul Rahman",
      gender: "L",
      birthDate: new Date("2011-01-30"),
      address: "Jl. Thamrin No. 5",
      createdAt: new Date("2025-12-02T04:51:23.374Z"),
      updatedAt: new Date("2025-12-02T04:51:23.374Z"),
    },
    {
      id: 3,
      guardianId: 20,
      name: "santri 1",
      gender: "P",
      birthDate: new Date("1994-01-01"),
      address: "Cileunyi",
      createdAt: new Date("2025-11-13T09:30:28.439Z"),
      updatedAt: new Date("2025-12-02T05:18:57.409Z"),
    },
    {
      id: 4,
      guardianId: 18,
      name: "VDOT",
      gender: "L",
      birthDate: new Date("2009-02-17"),
      address: "Cileunyi",
      createdAt: new Date("2025-11-17T09:53:12.990Z"),
      updatedAt: new Date("2025-12-02T05:22:06.782Z"),
    },
  ];

  for (const s of santri) {
    await prisma.santri.upsert({
      where: { id: s.id },
      update: {
        guardianId: s.guardianId,
        name: s.name,
        gender: s.gender,
        birthDate: s.birthDate,
        address: s.address,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      },
      create: {
        id: s.id,
        guardianId: s.guardianId,
        name: s.name,
        gender: s.gender,
        birthDate: s.birthDate,
        address: s.address,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      },
    });
  }

  // ============================================
  // 4. Seed Invoice (4 data) - FIXED
  // ============================================
  console.log("Seeding Invoice data...");

  const invoices = [
    {
      id: 1,
      santriId: 3,
      amount: 500000,
      description: "SPP November 2025",
      dueDate: new Date("2025-11-30"),
      status: InvoiceStatus.PENDING,
      createdAt: new Date("2025-11-27T05:30:10.718Z"),
      updatedAt: new Date("2025-11-27T05:30:10.718Z"),
    },
    {
      id: 2,
      santriId: 4,
      amount: 499999,
      description: "SPP",
      dueDate: new Date("2025-11-30"),
      status: InvoiceStatus.PENDING,
      createdAt: new Date("2025-11-27T05:41:34.629Z"),
      updatedAt: new Date("2025-11-27T05:41:34.629Z"),
    },
    {
      id: 3,
      santriId: 3,
      amount: 150000,
      description: "test",
      dueDate: new Date("2025-11-30"),
      status: InvoiceStatus.PENDING,
      createdAt: new Date("2025-11-27T06:47:37.735Z"),
      updatedAt: new Date("2025-11-27T06:47:37.735Z"),
    },
    {
      id: 4,
      santriId: 7,
      amount: 500000,
      description: "SPP Bulanan",
      dueDate: new Date("2026-01-24"),
      status: InvoiceStatus.PENDING,
      createdAt: new Date("2025-12-09T09:44:45.046Z"),
      updatedAt: new Date("2025-12-09T09:44:45.046Z"),
    },
  ];

  for (const invoice of invoices) {
    await prisma.invoice.upsert({
      where: { id: invoice.id },
      update: {
        santriId: invoice.santriId,
        amount: invoice.amount,
        description: invoice.description,
        dueDate: invoice.dueDate,
        status: invoice.status,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
      create: {
        id: invoice.id,
        santriId: invoice.santriId,
        amount: invoice.amount,
        description: invoice.description,
        dueDate: invoice.dueDate,
        status: invoice.status,
        createdAt: invoice.createdAt,
        updatedAt: invoice.updatedAt,
      },
    });
  }

  // ============================================
  // 5. Seed Payment (6 data) - FIXED
  // ============================================
  console.log("Seeding Payment data...");

  const payments = [
    {
      id: 2,
      invoiceId: 2,
      amount: 499999,
      method: PaymentMethod.EWALLET,
      status: PaymentStatus.PENDING,
      paidAt: null,
      createdAt: new Date("2025-11-27T06:31:46.395Z"),
    },
    {
      id: 3,
      invoiceId: 1,
      amount: 500000,
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PENDING,
      paidAt: null,
      createdAt: new Date("2025-11-27T06:32:18.898Z"),
    },
    {
      id: 4,
      invoiceId: 1,
      amount: 500000,
      method: PaymentMethod.EWALLET,
      status: PaymentStatus.PENDING,
      paidAt: null,
      createdAt: new Date("2025-11-27T06:32:36.763Z"),
    },
    {
      id: 5,
      invoiceId: 1,
      amount: 500000,
      method: PaymentMethod.VA,
      status: PaymentStatus.PENDING,
      paidAt: null,
      createdAt: new Date("2025-11-28T02:46:32.666Z"),
    },
    {
      id: 6,
      invoiceId: 1,
      amount: 500000,
      method: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.PENDING,
      paidAt: null,
      createdAt: new Date("2025-12-02T05:33:48.897Z"),
    },
    {
      id: 7,
      invoiceId: 1,
      amount: 500000,
      method: PaymentMethod.VA,
      status: PaymentStatus.PENDING,
      paidAt: null,
      createdAt: new Date("2025-12-09T09:31:10.889Z"),
    },
  ];

  for (const payment of payments) {
    await prisma.payment.upsert({
      where: { id: payment.id },
      update: {
        invoiceId: payment.invoiceId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      },
      create: {
        id: payment.id,
        invoiceId: payment.invoiceId,
        amount: payment.amount,
        method: payment.method,
        status: payment.status,
        paidAt: payment.paidAt,
        createdAt: payment.createdAt,
      },
    });
  }

  // ============================================
  // 6. Seed Savings (2 data) - FIXED
  // ============================================
  console.log("Seeding Savings data...");

  const savings = [
    {
      id: 3,
      santriId: 4,
      balance: 491400,
      createdAt: new Date("2025-11-21T09:02:47.237Z"),
      updatedAt: new Date("2025-11-21T09:02:47.237Z"),
    },
    {
      id: 2,
      santriId: 3,
      balance: 966647,
      createdAt: new Date("2025-11-21T08:46:20.090Z"),
      updatedAt: new Date("2025-11-21T08:46:20.090Z"),
    },
  ];

  for (const saving of savings) {
    await prisma.savings.upsert({
      where: { id: saving.id },
      update: {
        santriId: saving.santriId,
        balance: saving.balance,
        createdAt: saving.createdAt,
        updatedAt: saving.updatedAt,
      },
      create: {
        id: saving.id,
        santriId: saving.santriId,
        balance: saving.balance,
        createdAt: saving.createdAt,
        updatedAt: saving.updatedAt,
      },
    });
  }

  // ============================================
  // 7. Seed SavingsTransaction (9 data) - FIXED
  // ============================================
  console.log("Seeding SavingsTransaction data...");

  const savingsTransactions = [
    {
      id: 1,
      savingsId: 3,
      type: TransactionType.INCOME,
      amount: 546000,
      description: "test",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: null,
      approvedBy: null,
      approvedAt: new Date("2025-11-28T02:43:39.697Z"),
      createdAt: new Date("2025-11-27T07:30:19.851Z"),
      updatedAt: new Date("2025-11-28T02:43:39.700Z"),
    },
    {
      id: 2,
      savingsId: 2,
      type: TransactionType.INCOME,
      amount: 1950000,
      description: "tabungan",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: null,
      approvedBy: null,
      approvedAt: new Date("2025-11-28T02:45:57.209Z"),
      createdAt: new Date("2025-11-28T02:45:36.575Z"),
      updatedAt: new Date("2025-11-28T02:45:57.211Z"),
    },
    {
      id: 3,
      savingsId: 3,
      type: TransactionType.EXPENSE,
      amount: 54600,
      description: "Canteen payment to merchant 1",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: 1,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date("2025-12-01T04:16:18.876Z"),
      updatedAt: new Date("2025-12-01T04:16:18.876Z"),
    },
    {
      id: 4,
      savingsId: 2,
      type: TransactionType.EXPENSE,
      amount: 65700,
      description: "Canteen payment to merchant 3",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: 1,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date("2025-12-31T07:21:50.954Z"),
      updatedAt: new Date("2025-12-31T07:21:50.954Z"),
    },
    {
      id: 5,
      savingsId: 2,
      type: TransactionType.EXPENSE,
      amount: 65700,
      description: "Canteen payment to merchant 3",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: 1,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date("2025-12-31T07:22:00.882Z"),
      updatedAt: new Date("2025-12-31T07:22:00.882Z"),
    },
    {
      id: 6,
      savingsId: 2,
      type: TransactionType.EXPENSE,
      amount: 65700,
      description: "Canteen payment to merchant 3",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: 1,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date("2025-12-31T07:22:04.887Z"),
      updatedAt: new Date("2025-12-31T07:22:04.887Z"),
    },
    {
      id: 7,
      savingsId: 2,
      type: TransactionType.EXPENSE,
      amount: 65700,
      description: "Canteen payment to merchant 4",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: 1,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date("2025-12-31T07:24:23.238Z"),
      updatedAt: new Date("2025-12-31T07:24:23.238Z"),
    },
    {
      id: 8,
      savingsId: 2,
      type: TransactionType.EXPENSE,
      amount: 654655,
      description: "Canteen payment to merchant 3",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: 1,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date("2025-12-31T07:25:24.668Z"),
      updatedAt: new Date("2025-12-31T07:25:24.668Z"),
    },
    {
      id: 9,
      savingsId: 2,
      type: TransactionType.EXPENSE,
      amount: 65898,
      description: "Canteen payment to merchant 4",
      proofUrl: null,
      status: TransactionStatus.APPROVED,
      createdBy: 1,
      approvedBy: null,
      approvedAt: null,
      createdAt: new Date("2025-12-31T07:30:33.522Z"),
      updatedAt: new Date("2025-12-31T07:30:33.522Z"),
    },
  ];

  for (const transaction of savingsTransactions) {
    await prisma.savingsTransaction.upsert({
      where: { id: transaction.id },
      update: {
        savingsId: transaction.savingsId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        proofUrl: transaction.proofUrl,
        status: transaction.status,
        createdBy: transaction.createdBy,
        approvedBy: transaction.approvedBy,
        approvedAt: transaction.approvedAt,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
      create: {
        id: transaction.id,
        savingsId: transaction.savingsId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        proofUrl: transaction.proofUrl,
        status: transaction.status,
        createdBy: transaction.createdBy,
        approvedBy: transaction.approvedBy,
        approvedAt: transaction.approvedAt,
        createdAt: transaction.createdAt,
        updatedAt: transaction.updatedAt,
      },
    });
  }

  // ============================================
  // 8. Seed Merchant (3 data) - FIXED
  // ============================================
  console.log("Seeding Merchant data...");

  const merchants = [
    {
      id: 1,
      userId: 1,
      name: "test",
      balance: 54600,
      createdAt: new Date("2025-12-01T04:11:45.032Z"),
      updatedAt: new Date("2025-12-01T04:16:18.929Z"),
    },
    {
      id: 3,
      userId: 21,
      name: "Pemilik Kantin A's Store",
      balance: 10851755,
      createdAt: new Date("2025-12-02T04:51:23.378Z"),
      updatedAt: new Date("2025-12-31T07:25:24.706Z"),
    },
    {
      id: 4,
      userId: 22,
      name: "Pemilik Kantin B's Store",
      balance: 10131598,
      createdAt: new Date("2025-12-02T04:51:23.386Z"),
      updatedAt: new Date("2025-12-31T07:30:33.567Z"),
    },
  ];

  for (const merchant of merchants) {
    await prisma.merchant.upsert({
      where: { id: merchant.id },
      update: {
        userId: merchant.userId,
        name: merchant.name,
        balance: merchant.balance,
        createdAt: merchant.createdAt,
        updatedAt: merchant.updatedAt,
      },
      create: {
        id: merchant.id,
        userId: merchant.userId,
        name: merchant.name,
        balance: merchant.balance,
        createdAt: merchant.createdAt,
        updatedAt: merchant.updatedAt,
      },
    });
  }

  // ============================================
  // 9. Seed PpdbApplicant (1 data) - FIXED
  // ============================================
  console.log("Seeding PpdbApplicant data...");

  await prisma.ppdbApplicant.upsert({
    where: { id: 1 },
    update: {
      name: "Utuni",
      gender: "Perempuan",
      birthDate: new Date("2014-06-18"),
      address: "Dusun Canukur RT/RW 003/001\nDesa Sukaluyu, Kecamatan Ganeas",
      guardianName: "Rosidah",
      guardianPhone: "085161141305",
      email: "utuni@gmail.com",
      registrationNo: "PPDB-0001",
      status: PpdbStatus.ACCEPTED,
      paymentStatus: PaymentStatus.PENDING,
      paymentId: null,
      createdAt: new Date("2025-11-28T12:46:21.123Z"),
      updatedAt: new Date("2025-11-28T12:46:41.654Z"),
    },
    create: {
      id: 1,
      name: "Utuni",
      gender: "Perempuan",
      birthDate: new Date("2014-06-18"),
      address: "Dusun Canukur RT/RW 003/001\nDesa Sukaluyu, Kecamatan Ganeas",
      guardianName: "Rosidah",
      guardianPhone: "085161141305",
      email: "utuni@gmail.com",
      registrationNo: "PPDB-0001",
      status: PpdbStatus.ACCEPTED,
      paymentStatus: PaymentStatus.PENDING,
      paymentId: null,
      createdAt: new Date("2025-11-28T12:46:21.123Z"),
      updatedAt: new Date("2025-11-28T12:46:41.654Z"),
    },
  });

  // ============================================
  // 10. Seed PpdbDocument (1 data) - FIXED
  // ============================================
  console.log("Seeding PpdbDocument data...");

  await prisma.ppdbDocument.upsert({
    where: { id: 1 },
    update: {
      applicantId: 1,
      fileName: "IMG-20230103-WA0001.jpeg",
      filePath: "/uploads/undefined",
      createdAt: new Date("2025-11-28T12:53:41.098Z"),
    },
    create: {
      id: 1,
      applicantId: 1,
      fileName: "IMG-20230103-WA0001.jpeg",
      filePath: "/uploads/undefined",
      createdAt: new Date("2025-11-28T12:53:41.098Z"),
    },
  });

  // ============================================
  // 11. Seed TahfidzRecord (1 data) - FIXED
  // ============================================
  console.log("Seeding TahfidzRecord data...");

  await prisma.tahfidzRecord.upsert({
    where: { id: 3 },
    update: {
      santriId: 4,
      juz: 1,
      pageStart: 1,
      pageEnd: 11,
      score: 87,
      remarks: "good",
      teacherId: null,
      createdAt: new Date("2025-12-08T08:39:26.220Z"),
      updatedAt: new Date("2025-12-08T08:39:26.220Z"),
    },
    create: {
      id: 3,
      santriId: 4,
      juz: 1,
      pageStart: 1,
      pageEnd: 11,
      score: 87,
      remarks: "good",
      teacherId: null,
      createdAt: new Date("2025-12-08T08:39:26.220Z"),
      updatedAt: new Date("2025-12-08T08:39:26.220Z"),
    },
  });

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error("Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
