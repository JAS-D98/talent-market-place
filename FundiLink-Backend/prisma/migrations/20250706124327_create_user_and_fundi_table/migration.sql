/*
  Warnings:

  - You are about to drop the column `available` on the `users_table` table. All the data in the column will be lost.
  - You are about to drop the column `badge` on the `users_table` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `users_table` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users_table` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `users_table` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `users_table` table. All the data in the column will be lost.
  - You are about to drop the column `responseTime` on the `users_table` table. All the data in the column will be lost.
  - You are about to drop the column `reviews` on the `users_table` table. All the data in the column will be lost.
  - You are about to drop the column `service` on the `users_table` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `users_table` table without a default value. This is not possible if the table is not empty.
  - Made the column `verified` on table `users_table` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users_table" DROP COLUMN "available",
DROP COLUMN "badge",
DROP COLUMN "image",
DROP COLUMN "location",
DROP COLUMN "price",
DROP COLUMN "rating",
DROP COLUMN "responseTime",
DROP COLUMN "reviews",
DROP COLUMN "service",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "fundiProfileId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "verified" SET NOT NULL,
ALTER COLUMN "verified" SET DEFAULT 'UNVERIFIED',
ALTER COLUMN "role" SET DEFAULT 'USER';

-- CreateTable
CREATE TABLE "fundis_table" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "rating" DOUBLE PRECISION,
    "reviews" INTEGER,
    "hourlyRate" DOUBLE PRECISION,
    "image" TEXT,
    "location" TEXT,
    "responseTime" DOUBLE PRECISION,
    "badge" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "earnings" DOUBLE PRECISION DEFAULT 0,
    "completedJobs" INTEGER DEFAULT 0,
    "appliedDate" TIMESTAMP(3),
    "documents" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "fundis_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fundis_table_userId_key" ON "fundis_table"("userId");

-- AddForeignKey
ALTER TABLE "fundis_table" ADD CONSTRAINT "fundis_table_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users_table"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
