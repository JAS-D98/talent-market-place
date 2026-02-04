/*
  Warnings:

  - Added the required column `badge` to the `users_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `users_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `location` to the `users_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `users_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `users_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `responseTime` to the `users_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reviews` to the `users_table` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `users_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users_table" ADD COLUMN     "available" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "badge" TEXT NOT NULL,
ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "location" TEXT NOT NULL,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "responseTime" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "reviews" BIGINT NOT NULL,
ADD COLUMN     "service" TEXT NOT NULL,
ADD COLUMN     "verified" TEXT NOT NULL DEFAULT 'unverified';
