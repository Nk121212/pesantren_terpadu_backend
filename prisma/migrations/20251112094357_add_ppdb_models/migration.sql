-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INCOME', 'EXPENSE');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PpdbStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "Finance" (
    "id" SERIAL NOT NULL,
    "type" "TransactionType" NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "proofUrl" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdBy" INTEGER,
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Finance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Savings" (
    "id" SERIAL NOT NULL,
    "santriId" INTEGER NOT NULL,
    "balance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Savings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavingsTransaction" (
    "id" SERIAL NOT NULL,
    "savingsId" INTEGER NOT NULL,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "description" TEXT,
    "proofUrl" TEXT,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "createdBy" INTEGER,
    "approvedBy" INTEGER,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavingsTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PpdbApplicant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3),
    "address" TEXT,
    "guardianName" TEXT,
    "guardianPhone" TEXT,
    "email" TEXT,
    "registrationNo" TEXT,
    "status" "PpdbStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PpdbApplicant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PpdbDocument" (
    "id" SERIAL NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PpdbDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Savings_santriId_key" ON "Savings"("santriId");

-- CreateIndex
CREATE UNIQUE INDEX "PpdbApplicant_email_key" ON "PpdbApplicant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PpdbApplicant_registrationNo_key" ON "PpdbApplicant"("registrationNo");

-- AddForeignKey
ALTER TABLE "Savings" ADD CONSTRAINT "Savings_santriId_fkey" FOREIGN KEY ("santriId") REFERENCES "Santri"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavingsTransaction" ADD CONSTRAINT "SavingsTransaction_savingsId_fkey" FOREIGN KEY ("savingsId") REFERENCES "Savings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PpdbDocument" ADD CONSTRAINT "PpdbDocument_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "PpdbApplicant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
