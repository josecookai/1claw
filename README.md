# 1claw - The Private Server for Your AI Workforce

[![OpenClaw-as-a-Service](https://img.shields.io/badge/OpenClaw--as--a--Service-1Claw-black)](https://1claw.vercel.app)

Instead of using a shared AI, you're logging into your own dedicated agent station.

你不是在用“共享 AI 租户”，而是在登录你自己的专属 Agent 工作站。

## 2026 SOTA Dual-Core Architecture

```text
            ┌─────────────────────────────────────────────────────────┐
            │                 1claw WEB DASHBOARD                     │
            │      (User-Owned / Self-Hosted Server Interface)        │
            └────────────────────────────┬────────────────────────────┘
                                         │
                   ─── SECURE WEBSOCKET / LOCAL TUNNEL ───
                                         │
         ┌───────────────────────────────┴───────────────────────────────┐
         ▼                                                               ▼
   🧠 THE BRAIN (SOTA LLMs)                              🦀 THE HAND (1claw Orchestrator)
   [ Native Support For ]                                [ Agentic Execution ]
   ├─ Anthropic: Claude Opus 4.6                         ├─ Multi-Step Task Planner
   ├─ OpenAI: GPT-5.3-Codex / 5.2                        ├─ Recursive Debugging
   ├─ Google: Gemini 3 Pro / Ultra                       ├─ Real-time Tool Calling
   └─ Moonshot: Kimi K2.5 (Agent Swarm)                  └─ Contextual Memory Bridge
         │                                                               │
         └───────────────────────────────┬───────────────────────────────┘
                                         │
                          ─── MCP PROTOCOL FABRIC ───
                                         │
         ┌───────────────────────────────┼───────────────────────────────┐
         │                               │                               │
         ▼                               ▼                               ▼
  📂 LOCAL ENVIRONMENT           🌐 CLOUD WORKSPACE              📊 DATA INFRA
  (Full FS, Terminal, IDE)       (GitHub, Slack, AWS)            (Postgres, Redis)
  
      [ EXECUTE ]                     [ CONNECT ]                    [ ANALYZE ]
```

## Product Narrative (EN + 中文)

### Self-Hosted Sovereignty / 自托管主权

EN: You are no longer a tenant, you are the landlord. Log into your own server via 1claw, and run all MCP tools in your controlled environment.

中文：你不再是一个租户，而是房东。通过 1claw 登录你自己的服务器，所有 MCP 工具集都在你受控的环境下运行。

### Plug-and-Play Brains / 即插即用的大脑层

EN: Switch top-tier models anytime. Use GPT-5.3-Codex for rigorous coding logic, Kimi K2.5 for long-context office automation (1500+ parallel tool calls), or Claude Opus 4.6 for deep local file understanding.

中文：随时切换最强模型。无论是追求代码逻辑的 GPT-5.3-Codex，还是擅长长文本处理与办公自动化的 Kimi K2.5（支持 1500+ 工具并发调用），或者具备深度本地文件理解能力的 Claude Opus 4.6，都可以直接接入。

### Identity First / 身份先行

EN: Login establishes your private control plane. 1claw syncs your preferences, MCP server choices, and prior agent execution memory.

中文：登录即建立连接。1claw 自动同步你的个人偏好、常用 MCP Servers 以及之前 Agent 的执行记忆。

## Current Web Surface

- Landing: `/`
- Login: `/login`
- Onboarding: `/onboarding`
- Chat: `/chat`
- Usage: `/usage`
- Settings: `/settings`
- Connectors: `/settings/connectors`

## Optional Env Vars

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`
- `RESEND_API_KEY`
- `WAITLIST_FROM_EMAIL`
