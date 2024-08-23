/*
  Warnings:

  - You are about to drop the `credit_cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "credit_cards" DROP CONSTRAINT "credit_cards_owner_id_fkey";

-- DropTable
DROP TABLE "credit_cards";

-- CreateTable
CREATE TABLE "cards" (
    "id" TEXT NOT NULL,
    "number" BIGINT NOT NULL,
    "cvv" INTEGER NOT NULL,
    "credit_limit" INTEGER NOT NULL DEFAULT 0,
    "type" INTEGER NOT NULL,
    "owner_id" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cards_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cards" ADD CONSTRAINT "cards_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
