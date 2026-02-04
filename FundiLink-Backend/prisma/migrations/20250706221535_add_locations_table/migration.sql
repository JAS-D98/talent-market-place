/*
  Warnings:

  - You are about to drop the column `location` on the `fundis_table` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "fundis_table" DROP COLUMN "location",
ADD COLUMN     "locationId" TEXT;

-- CreateTable
CREATE TABLE "locations_table" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_table_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fundis_table" ADD CONSTRAINT "fundis_table_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations_table"("id") ON DELETE SET NULL ON UPDATE CASCADE;
