# 1Claw MVP Landing Page

Bilingual (ZH/EN) landing page for validating **OpenClaw as a Service** conversion.

## Features

- Single-page IA with Hero, Value Props, Pain Points, Builder, Pricing, Payments, Skills, FAQ, Compliance
- Multi-select model picker: Bailian, Hunyuan, Kimi, GLM, Claude, GPT-5.2, Gemini 3
- Multi-select channel picker: WeChat, Feishu, DingTalk, Telegram, Discord, Slack (all marked Beta)
- Pricing tiers: `$20 / $40 / $200`
- Payment methods: Stripe, Alipay, WeChat Pay, USDC (Base/Solana)
- Dual CTA flow: `Start Checkout` + `Join Waitlist`
- Query params appended on outbound links: `plan`, `models`, `channels`, `lang`, `source=landing_v1`
- Placeholder Terms and Privacy pages
- Minimal `POST /api/lead` interface for waitlist/sales payload validation

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and replace with your real links.

```bash
cp .env.example .env.local
```

## Validation Commands

```bash
npm run lint
npm run build
```

## Deploy to Vercel (Claimable Preview)

```bash
bash /Users/bowenwang/.codex/skills/vercel-deploy/scripts/deploy.sh /Users/bowenwang/1Claw
```

The script returns:

- Preview URL (public live link)
- Claim URL (transfer deployment to your Vercel account)
