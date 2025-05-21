/*
  Warnings:

  - Added the required column `book_pdf` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "books" ADD COLUMN     "book_pdf" TEXT NOT NULL;
