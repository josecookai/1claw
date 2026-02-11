# Frontend Structure Discovery

## 1) Repository Shape

This repository currently contains **two Next.js frontends**:

1. Root frontend (legacy/current landing deploy target)
- Path: `/Users/bowenwang/1Claw`
- Router: App Router (`app/` exists)
- Landing entry: `app/page.tsx`

2. Monorepo frontend (product engineering target)
- Path: `/Users/bowenwang/1Claw/openclaw-cloud/apps/web`
- Router: App Router (`src/app/` exists)
- Suggested product routes should be implemented here.

## 2) package.json Locations

- `/Users/bowenwang/1Claw/package.json`
- `/Users/bowenwang/1Claw/openclaw-cloud/package.json`
- `/Users/bowenwang/1Claw/openclaw-cloud/apps/web/package.json`
- `/Users/bowenwang/1Claw/openclaw-cloud/apps/api/package.json`
- `/Users/bowenwang/1Claw/openclaw-cloud/apps/bot-telegram/package.json`
- `/Users/bowenwang/1Claw/openclaw-cloud/packages/shared/package.json`
- `/Users/bowenwang/1Claw/openclaw-cloud/packages/router-core/package.json`

## 3) Frontend Working Convention

For product engineering issues (pricing/onboarding/chat/topup/usage/settings):

- Primary app: `/Users/bowenwang/1Claw/openclaw-cloud/apps/web`
- Routes (App Router): `/Users/bowenwang/1Claw/openclaw-cloud/apps/web/src/app/**`
- Components (recommended):
  - Shared UI: `/Users/bowenwang/1Claw/openclaw-cloud/apps/web/src/components`
  - Page-local components: colocate inside each route folder if small
- Styling: Tailwind CSS (as configured in app)

## 4) Landing Entry Confirmation

Current deployed landing baseline V1 is from root frontend:
- Route: `/`
- File: `/Users/bowenwang/1Claw/app/page.tsx`

## 5) Guardrail

To avoid editing the wrong app:
- If task says "landing page V1/V2/V3", edit root app (`/Users/bowenwang/1Claw/app`).
- If task says "product engineering" or issues under `openclaw-cloud`, edit `/Users/bowenwang/1Claw/openclaw-cloud/apps/web/src/app`.
