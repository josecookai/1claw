-- CreateEnum
CREATE TYPE "CreditLedgerReason" AS ENUM ('SUB_GRANT', 'TOPUP', 'CHAT_DEBIT', 'ADJUST');

-- AlterTable: add note column
ALTER TABLE "CreditLedger" ADD COLUMN "note" TEXT;

-- AlterTable: change reason from text to enum (preserve existing data)
ALTER TABLE "CreditLedger" ALTER COLUMN "reason" TYPE "CreditLedgerReason" USING ("reason"::"CreditLedgerReason");

-- Recreate index: drop userId-only, add userId+createdAt composite
DROP INDEX IF EXISTS "CreditLedger_userId_idx";
CREATE INDEX "CreditLedger_userId_createdAt_idx" ON "CreditLedger"("userId", "createdAt");
