# OpenClaw Cloud

Monorepo for OpenClaw as a Service: multi-model routing, subscription billing, Telegram bot.

## 本地启动

```bash
cd openclaw-cloud
pnpm i
cd infra/docker && docker compose up -d
cd ../..
cp apps/api/.env.example apps/api/.env
pnpm db:migrate
pnpm db:seed
pnpm dev
```

- Web: http://localhost:3000
- API: http://localhost:3001/api
- Bot: 需配置 `TELEGRAM_BOT_TOKEN`、`API_BASE_URL`（API 地址）、`REDIS_URL`

## 项目结构

- `apps/web` - Next.js: Landing、Onboarding 三步、Console
- `apps/api` - NestJS: auth、billing、chat、instances、bind
- `apps/bot-telegram` - Telegraf: /bind、消息转发
- `packages/shared` - 共享类型、错误码
- `packages/router-core` - 档位策略、stub 两家、fallback
