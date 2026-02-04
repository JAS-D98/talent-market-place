/*
  Warnings:

  - Added the required column `phone` to the `users_table` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users_table" ADD COLUMN     "phone" TEXT NOT NULL;
