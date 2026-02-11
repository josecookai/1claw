-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "plan" TEXT NOT NULL,
    "models" TEXT NOT NULL,
    "channels" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "intent" TEXT NOT NULL,
    "source" TEXT DEFAULT 'landing_v1',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "Lead_intent_idx" ON "Lead"("intent");
