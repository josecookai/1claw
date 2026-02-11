# OpenClaw Cloud 产品/架构契约

## 1. 模块边界图

```
┌─────────────────────────────────────────────────────────────────────────┐
│  apps/web                    │  用户入口：Landing、Onboarding、Console   │
│  Next.js App Router          │  不暴露云厂商、选档位不选模型              │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  apps/api                     │  Auth、Billing、Instances、Chat、Router  │
│  NestJS                       │  统一入口：POST /v1/chat                  │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTP / 内部调用
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  packages/router-core         │  档位策略 → Provider 路由 + fallback     │
│  纯库                          │  route(request, policy) → {provider,model}│
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  apps/bot-telegram            │  Telegraf：/bind、消息转发               │
│  Telegraf                     │  调用 apps/api 的 /v1/chat               │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTP
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  apps/api                     │  （同上）                                │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│  infra                        │  Postgres、Redis、Docker Compose          │
└─────────────────────────────────────────────────────────────────────────┘
```

**职责边界**：

| 模块 | 职责 |
|------|------|
| web | 落地页、Onboarding 三步、Console 展示 |
| api | 认证、计费、实例管理、Chat 入口、Usage 计量 |
| router-core | 档位 → Provider 映射、fallback 策略 |

---

## 2. 统一错误码

| 错误码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| `ROUTER_NO_PROVIDER` | 503 | 无可用路由目标，所有 provider 均不可用 |
| `ROUTER_TIMEOUT` | 504 | 路由超时（可 retry） |
| `ROUTER_RATE_LIMITED` | 429 | Provider 限流（可 retry） |
| `BILLING_QUOTA_EXCEEDED` | 402 | 额度超限，需升级或等待下个周期 |
| `BILLING_SUBSCRIPTION_INACTIVE` | 402 | 订阅未激活或已过期 |
| `INSTANCE_NOT_FOUND` | 404 | 实例不存在 |
| `INSTANCE_PROVISIONING` | 409 | 实例仍在创建中 |
| `AUTH_INVALID_CREDENTIALS` | 401 | 认证失败 |
| `BIND_CODE_INVALID` | 400 | 绑定码无效或已过期 |

---

## 3. Router API 契约

### 3.1 路由请求

```typescript
interface RouteRequest {
  userId: string;
  message: string;
  policy: 'BEST' | 'CHEAP' | 'CN_OK';
}
```

### 3.2 路由结果

```typescript
interface RouteResult {
  provider: string;   // e.g. "kimi", "openai"
  model: string;      // e.g. "moonshot-v1", "gpt-4o"
  headers?: Record<string, string>;
}
```

### 3.3 失败场景

```typescript
class RouterError extends Error {
  code: string;       // e.g. ROUTER_NO_PROVIDER
  message: string;
  retryable: boolean;
}
```

**示例**：

```json
// 成功
{ "provider": "kimi", "model": "moonshot-v1", "headers": {} }

// 失败
{ "code": "ROUTER_TIMEOUT", "message": "Provider kimi timeout", "retryable": true }
```

---

## 4. Billing 最小规则

| 套餐 | 并发 | 日额度 | 降级策略 |
|------|------|--------|----------|
| $20 (starter_20) | 共享 | 50k tokens/日 | 低优先级 |
| $40 (pro_40) | 独立 | 100k tokens/日 | 自动 fallback |
| $200 (max_200) | 专属 | 500k tokens/日 | 自定义 |

---

## 5. Instance Lifecycle API（占位）

| 接口 | 方法 | 说明 |
|------|------|------|
| 创建实例 | `POST /v1/instances` | body: `{ region: string }`，返回 `{ id, status: PROVISIONING }` |
| 查询状态 | `GET /v1/instances/:id` | 返回 `{ id, status, region, createdAt }` |
| 停止（占位） | `POST /v1/instances/:id/stop` | 后续实现 |

**status**：`PROVISIONING` | `RUNNING` | `STOPPED` | `ERROR`

**不暴露**：云厂商字段（AWS/阿里/腾讯等）。`region` 可为 `"cn-east"` 等抽象值。
