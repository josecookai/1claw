#!/usr/bin/env tsx
/**
 * Run: pnpm db:seed (or pnpm exec tsx scripts/seed.ts)
 * Seed logic lives in apps/api/prisma/seed.ts
 */
import { execSync } from 'child_process';
execSync('pnpm --filter api exec prisma db seed', { stdio: 'inherit', cwd: __dirname + '/..' });
