-- CreateTable
CREATE TABLE "Santri" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nis" TEXT NOT NULL,
    "kelas" TEXT NOT NULL,
    "alamat" TEXT,
    "tanggalLahir" TIMESTAMP(3),
    "guardianId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Santri_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Santri_nis_key" ON "Santri"("nis");

-- AddForeignKey
ALTER TABLE "Santri" ADD CONSTRAINT "Santri_guardianId_fkey" FOREIGN KEY ("guardianId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
