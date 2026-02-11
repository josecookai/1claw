-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Backfill: placeholder for existing users (login will fail until reset)
UPDATE "User" SET "password" = '$2b$10$' || repeat('x', 53) WHERE "password" IS NULL;

ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
