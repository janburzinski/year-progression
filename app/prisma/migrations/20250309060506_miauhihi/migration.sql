/*
  Warnings:

  - The `date` column on the `Entry` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `content` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Entry" ADD COLUMN     "content" TEXT NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP;
