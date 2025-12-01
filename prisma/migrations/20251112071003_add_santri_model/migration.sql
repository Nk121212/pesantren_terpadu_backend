/*
  Warnings:

  - You are about to drop the column `alamat` on the `Santri` table. All the data in the column will be lost.
  - You are about to drop the column `kelas` on the `Santri` table. All the data in the column will be lost.
  - You are about to drop the column `nama` on the `Santri` table. All the data in the column will be lost.
  - You are about to drop the column `nis` on the `Santri` table. All the data in the column will be lost.
  - You are about to drop the column `tanggalLahir` on the `Santri` table. All the data in the column will be lost.
  - Added the required column `name` to the `Santri` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Santri_nis_key";

-- AlterTable
ALTER TABLE "Santri" DROP COLUMN "alamat",
DROP COLUMN "kelas",
DROP COLUMN "nama",
DROP COLUMN "nis",
DROP COLUMN "tanggalLahir",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "birthDate" TIMESTAMP(3),
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;
