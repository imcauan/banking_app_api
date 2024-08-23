/*
  Warnings:

  - Added the required column `type` to the `credit_cards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_cards" ADD COLUMN     "type" INTEGER NOT NULL;
