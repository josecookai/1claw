export type Lang = "zh" | "en";

export const copy = {
  zh: {
    nav: { pricing: "价格", start: "开始使用", login: "登录" },
    hero: {
      h1: "1 分钟拥有你的 AI Agent",
      sub: "不懂服务器、不配 API、不选模型。直接在网页开始用，自动省钱、永不冻结。",
      primary: "开始使用",
      secondary: "查看价格",
      tertiary: "加入候补",
    },
    pills: ["永不冷却", "无需 API Key", "智能路由", "中国 + 全球可用"],
    demo: {
      title: "像在用 Manus 一样：打开网页就能聊",
      hint: "系统会自动选择最合适模型，并按 Credits 结算。",
      user: "帮我写一段 Python：抓取网页并把表格保存为 CSV",
      assistantTitle: "已完成（自动路由）",
      assistant:
        "我会用 requests + pandas.read_html 抓取页面表格，并保存为 CSV。下面是可直接运行的代码：\n\n```python\nimport pandas as pd\nimport requests\n\nurl = \"https://example.com\"\nhtml = requests.get(url, timeout=20).text\n\ndfs = pd.read_html(html)\ndf = dfs[0]\ndf.to_csv(\"table.csv\", index=False)\nprint(\"saved table.csv\")\n```\n\n如果页面有多个表格，我也可以帮你选择包含目标列的那一个。",
      meta: {
        mode: "模式",
        strong: "强",
        smart: "智能",
        light: "省钱",
        routing: "路由",
        auto: "自动",
        credits: "本次消耗",
      },
      degraded: "额度不足时：自动降级 + 智能排队 + 可一键加购",
    },
    value: {
      title: "你只需要结果，我们处理复杂性。",
      items: [
        {
          h: "30+ 模型全部包含",
          p: "OpenAI / Anthropic / Google / DeepSeek / xAI 与国内主流模型，一套账户一套余额。",
        },
        {
          h: "ClawRouter 智能路由",
          p: "14 维度评分，<1ms 决策：简单任务走更经济模型，复杂任务用更强模型。",
        },
        {
          h: "用完也不冻结",
          p: "超额后自动降级 + 智能排队 + 一键 Top-Up，永远可用。",
        },
      ],
    },
    pricing: {
      title: "价格",
      sub: "两档套餐 + 随时加购。无需自己配置任何 API。",
      starter: {
        name: "Starter",
        price: "$20 / 月",
        credits: "4000 Credits / 月",
        bullets: ["智能路由", "超额自动降级", "并发 1", "上下文 16K"],
        cta: "开始 Starter",
      },
      pro: {
        name: "Pro",
        price: "$200 / 月",
        credits: "50000 Credits / 月",
        bullets: ["优先路由", "更高并发 5", "上下文 128K", "可开启性能优先"],
        cta: "升级 Pro",
        badge: "适合重度使用",
      },
      topup: {
        title: "Top-Up（随时加购，不中断使用）",
        packs: ["$10 → 2000 Credits", "$50 → 12000 Credits"],
        note: "需要激活订阅后才能加购（防止退款套利）。",
      },
    },
    how: {
      title: "如何开始（3 步）",
      steps: [
        { h: "登录", p: "进入网页聊天界面，无需安装任何工具。" },
        { h: "直接提问", p: "ClawRouter 自动选择合适模型与成本。" },
        { h: "按量结算", p: "用 Credits 自动扣费：余额低时会自动降级/排队，可一键 Top-Up。" },
      ],
    },
    faq: {
      title: "常见问题",
      items: [
        { q: "Credits 是什么？", a: "Credits 是标准化的 AI 计算单位，用来统一不同模型的成本与额度。" },
        { q: "为什么我看不到模型选择？", a: "我们默认开启智能路由：系统为每次请求自动选择最合适的模型。" },
        { q: "用完会怎样？", a: "不会冻结：会自动降级到更经济模式，必要时进入排队，并可随时 Top-Up。" },
        { q: "中国能用吗？", a: "支持中国与海外可用性策略，系统会按可用性自动路由。" },
        { q: "支持哪些支付？", a: "支持信用卡，并逐步开放支付宝/微信/USDC（以页面显示为准）。" },
        { q: "我需要 API Key 吗？", a: "不需要。我们托管并统一结算，你只需登录使用。" },
      ],
    },
    final: {
      h: "现在开始，用 $20 体验你的 AI Agent。",
      p: "不用 CLI，不用服务器，不用配置。",
      primary: "开始使用",
      secondary: "查看价格",
    },
  },
  en: {
    nav: { pricing: "Pricing", start: "Start", login: "Login" },
    hero: {
      h1: "Get your AI Agent in 1 minute",
      sub: "No servers. No API keys. No model picking. Start in the browser with smart routing and never-freeze usage.",
      primary: "Start",
      secondary: "Pricing",
      tertiary: "Join waitlist",
    },
    pills: ["Always available", "No API setup", "Smart routing", "China + Global ready"],
    demo: {
      title: "Feels like Manus: just open the web chat",
      hint: "We automatically route to the best model and charge in Credits.",
      user: "Write Python to scrape a webpage table and save it as CSV",
      assistantTitle: "Done (auto routing)",
      assistant:
        "Here's a runnable example using requests + pandas.read_html:\n\n```python\nimport pandas as pd\nimport requests\n\nurl = \"https://example.com\"\nhtml = requests.get(url, timeout=20).text\n\ndfs = pd.read_html(html)\ndf = dfs[0]\ndf.to_csv(\"table.csv\", index=False)\nprint(\"saved table.csv\")\n```\n\nIf there are multiple tables, I can help select the right one.",
      meta: { mode: "Mode", strong: "Strong", smart: "Smart", light: "Saver", routing: "Routing", auto: "Auto", credits: "Cost" },
      degraded: "When credits run low: auto downgrade + smart queue + one-click top-up",
    },
    value: {
      title: "You focus on results. We handle the complexity.",
      items: [
        { h: "30+ models included", p: "OpenAI / Anthropic / Google / DeepSeek / xAI and major CN models - one account, one balance." },
        { h: "ClawRouter smart routing", p: "14-signal scoring, <1ms decision: cheap models for easy tasks, strong models for hard tasks." },
        { h: "Never freeze", p: "Auto downgrade + smart queue + top-up anytime." },
      ],
    },
    pricing: {
      title: "Pricing",
      sub: "Two plans + top-ups. No API key setup.",
      starter: { name: "Starter", price: "$20 / mo", credits: "4,000 Credits / mo", bullets: ["Smart routing", "Auto downgrade", "Concurrency 1", "Context 16K"], cta: "Start Starter" },
      pro: { name: "Pro", price: "$200 / mo", credits: "50,000 Credits / mo", bullets: ["Priority routing", "Concurrency 5", "Context 128K", "Max performance mode"], cta: "Go Pro", badge: "For power users" },
      topup: { title: "Top-Up (no interruption)", packs: ["$10 → 2,000 Credits", "$50 → 12,000 Credits"], note: "Top-ups require an active subscription." },
    },
    how: {
      title: "How it works",
      steps: [
        { h: "Login", p: "Enter web chat. No installs." },
        { h: "Ask anything", p: "ClawRouter routes automatically for cost and quality." },
        { h: "Pay with Credits", p: "Credits are deducted automatically; when low we downgrade/queue and offer top-ups." },
      ],
    },
    faq: {
      title: "FAQ",
      items: [
        { q: "What are Credits?", a: "Credits are standardized compute units that normalize cost across different models." },
        { q: "Why no model selector?", a: "Smart routing picks the best model automatically per request." },
        { q: "What happens when I run out?", a: "Never freeze: we downgrade, queue if needed, and you can top-up instantly." },
        { q: "Works in China?", a: "We support CN-friendly routing and global providers depending on availability." },
        { q: "Payments?", a: "Cards now; Alipay/WeChat/USDC shown when enabled." },
        { q: "Do I need API keys?", a: "No. We manage providers and billing for you." },
      ],
    },
    final: { h: "Start with $20 and get your AI Agent.", p: "No CLI. No servers. No setup.", primary: "Start", secondary: "Pricing" },
  },
} as const;
