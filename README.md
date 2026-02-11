# 1Claw

[![OpenClaw-as-a-Service](https://img.shields.io/badge/OpenClaw--as--a--Service-1Claw-black)](https://1claw.vercel.app)

1Claw is the zero-config layer for OpenClaw: open web chat, ask tasks, and get routed results without managing servers or model APIs.

## 30 Seconds to Deploy

1. Push to `main` in this repo.
2. Vercel auto-deploys to production.
3. Open [https://1claw.vercel.app](https://1claw.vercel.app) and start.

## Product Surface

- Manus-style landing with bilingual copy (`zh` + `en`)
- Waitlist capture (`POST /api/subscribe`) with optional Upstash persistence
- Optional confirmation email via Resend
- Web chat with visible execution stages (`Reading` -> `Routing` -> `Executing`)
- Local encrypted API key vault (AES-GCM in browser localStorage)
- Pre-hosted connector toggles (Google Drive MCP, Slack MCP, Notion MCP)
- Social sharing entry (X/Twitter)

## Core Routes

- `/` Landing
- `/login` Quick entry
- `/onboarding` Plan + preference
- `/chat` Web chat + top-up modal + execution status
- `/usage` Usage overview
- `/settings` Plan, connectors, API key vault
- `/settings/connectors` Pre-hosted connector toggles

## Environment Variables (Optional)

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`
- `WAITLIST_FROM_EMAIL`
