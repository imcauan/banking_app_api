-- AlterTable
ALTER TABLE "credit_cards" ALTER COLUMN "credit_limit" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "balance" SET DEFAULT 0,
ALTER COLUMN "credit_limit" SET DEFAULT 0,
ALTER COLUMN "monthly_budget" SET DEFAULT 0;
