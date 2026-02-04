/*
  Warnings:

  - Added the required column `serviceId` to the `fundis_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "fundis_table" ADD COLUMN     "serviceId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "fundis_table" ADD CONSTRAINT "fundis_table_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "services_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
