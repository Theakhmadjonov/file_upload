/*
  Warnings:

  - You are about to drop the column `book_pdf` on the `books` table. All the data in the column will be lost.
  - Added the required column `book_image` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" DROP COLUMN "book_pdf",
ADD COLUMN     "book_image" TEXT NOT NULL;
