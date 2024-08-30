/*
  Warnings:

  - You are about to drop the column `from` on the `transactions` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_from_fkey";

-- AlterTable
ALTER TABLE "transactions" DROP COLUMN "from",
ADD COLUMN     "members" TEXT[],
ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
