# 8 张 GitHub Issue 实施状态

已按建议顺序完成实现，对应关系如下：

| Issue | 状态 | 实现位置 |
|-------|------|----------|
| ISSUE 1 — 用户注册/登录 | ✅ | `apps/api/src/modules/auth/`, `apps/web/src/app/login`, `apps/web/src/app/register` |
| ISSUE 2 — Subscription 套餐选择 | ✅ | `apps/api/src/modules/subscription/`, `POST /v1/subscription/select` |
| ISSUE 3 — Telegram Bot 绑定 | ✅ | `apps/bot-telegram/src/handlers/bind.ts`, `apps/api/src/modules/bind/` |
| ISSUE 4 — Telegram Echo | ✅ | `apps/bot-telegram/src/handlers/message.ts`, `POST /v1/chat` |
| ISSUE 5 — Router Core | ✅ | `packages/router-core/` |
| ISSUE 6 — OpenAI Provider | ✅ | `packages/router-core/src/providers/openai.ts` |
| ISSUE 7 — Usage + Daily Limit | ✅ | `apps/api/src/modules/chat/`, `apps/api/src/modules/usage/`, Console 展示 |
| ISSUE 8 — Instance Lifecycle | ✅ | `apps/api/src/modules/instances/` |

## 环境变量

```bash
# .env
DATABASE_URL="postgresql://openclaw:openclaw@localhost:5432/openclaw"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="change-me-in-production"
OPENAI_API_KEY=""  # 可选，配置后使用真实 GPT
TELEGRAM_BOT_TOKEN=""
API_BASE_URL="http://localhost:3001/api"  # Bot 调用 API
INTERNAL_API_SECRET=""  # 与 API 一致，Bot 调用 Chat 时需传 X-Internal-Secret
```

## 迁移

```bash
pnpm db:migrate
pnpm db:seed
```
