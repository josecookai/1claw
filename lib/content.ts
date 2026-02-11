import {
  ChannelId,
  Lang,
  LocalizedText,
  ModelId,
  PaymentLinkMap,
  PaymentMethod,
  PlanId,
} from "@/lib/types";

export const BRAND_NAME = "1Claw";

export const MODELS: Array<{
  id: ModelId;
  name: string;
  hint: LocalizedText;
}> = [
  { id: "bailian", name: "Bailian", hint: { "zh-CN": "阿里生态", en: "Alibaba stack" } },
  { id: "hunyuan", name: "Hunyuan", hint: { "zh-CN": "腾讯生态", en: "Tencent stack" } },
  { id: "kimi", name: "Kimi", hint: { "zh-CN": "长文本强", en: "Long-context" } },
  { id: "glm", name: "GLM", hint: { "zh-CN": "国产稳态", en: "China-first" } },
  { id: "claude", name: "Claude", hint: { "zh-CN": "推理能力", en: "Reasoning" } },
  { id: "gpt-5-2", name: "GPT-5.2", hint: { "zh-CN": "全能旗舰", en: "Flagship" } },
  { id: "gemini-3", name: "Gemini 3", hint: { "zh-CN": "多模态", en: "Multimodal" } },
];

export const CHANNELS: Array<{
  id: ChannelId;
  name: string;
  hint: LocalizedText;
  badge: "Beta";
}> = [
  { id: "wechat", name: "WeChat", hint: { "zh-CN": "微信生态", en: "China social" }, badge: "Beta" },
  { id: "feishu", name: "Feishu", hint: { "zh-CN": "协作办公", en: "Work collaboration" }, badge: "Beta" },
  { id: "dingtalk", name: "DingTalk", hint: { "zh-CN": "企业沟通", en: "Enterprise chat" }, badge: "Beta" },
  { id: "telegram", name: "Telegram", hint: { "zh-CN": "全球覆盖", en: "Global coverage" }, badge: "Beta" },
  { id: "discord", name: "Discord", hint: { "zh-CN": "社区触达", en: "Community ops" }, badge: "Beta" },
  { id: "slack", name: "Slack", hint: { "zh-CN": "团队集成", en: "Team workflows" }, badge: "Beta" },
];

export const PAYMENT_METHODS: Array<{
  id: PaymentMethod;
  name: string;
  subtitle: LocalizedText;
}> = [
  { id: "stripe", name: "Stripe", subtitle: { "zh-CN": "信用卡", en: "Credit Card" } },
  { id: "alipay", name: "Alipay", subtitle: { "zh-CN": "支付宝", en: "Alipay" } },
  { id: "wechatpay", name: "WeChat Pay", subtitle: { "zh-CN": "微信支付", en: "WeChat Pay" } },
  { id: "usdc", name: "USDC", subtitle: { "zh-CN": "Base / Solana", en: "Base / Solana" } },
];

export const PLANS: Array<{
  id: PlanId;
  price: string;
  isPrimary?: boolean;
  title: LocalizedText;
  subtitle: LocalizedText;
  features: LocalizedText[];
}> = [
  {
    id: "starter_20",
    price: "$20",
    title: { "zh-CN": "Starter", en: "Starter" },
    subtitle: { "zh-CN": "适合首次尝试 AI Agent", en: "For first-time AI agent users" },
    features: [
      { "zh-CN": "共享算力", en: "Shared compute" },
      { "zh-CN": "基础自动路由", en: "Basic auto routing" },
      { "zh-CN": "每日额度", en: "Daily quota" },
      { "zh-CN": "低优先级", en: "Lower priority" },
    ],
  },
  {
    id: "pro_40",
    price: "$40",
    isPrimary: true,
    title: { "zh-CN": "Pro", en: "Pro" },
    subtitle: { "zh-CN": "主力套餐，平衡价格与稳定", en: "Best balance for scale and reliability" },
    features: [
      { "zh-CN": "独立实例", en: "Dedicated instance" },
      { "zh-CN": "更高额度", en: "Higher quota" },
      { "zh-CN": "自动 fallback", en: "Automatic fallback" },
      { "zh-CN": "可切模型", en: "Model switching" },
    ],
  },
  {
    id: "max_200",
    price: "$200",
    title: { "zh-CN": "Max", en: "Max" },
    subtitle: { "zh-CN": "面向重度与团队场景", en: "For power users and teams" },
    features: [
      { "zh-CN": "独立容器", en: "Dedicated container" },
      { "zh-CN": "专属额度池", en: "Private quota pool" },
      { "zh-CN": "自定义模型接入", en: "Custom model integration" },
      { "zh-CN": "24/7 保活", en: "24/7 always-on" },
    ],
  },
];

export const VALUE_PROPS: LocalizedText[] = [
  { "zh-CN": "Always Available", en: "Always Available" },
  { "zh-CN": "No API Setup", en: "No API Setup" },
  { "zh-CN": "Smart Fallback", en: "Smart Fallback" },
  { "zh-CN": "China + Global Ready", en: "China + Global Ready" },
];

export const PAIN_POINTS: LocalizedText[] = [
  { "zh-CN": "API Key 申请和配置太复杂", en: "API key setup is too complex" },
  { "zh-CN": "经常遇到限流和配额耗尽", en: "Rate limits and quota exhaustion" },
  { "zh-CN": "中国地区服务不稳定", en: "Unstable availability in China" },
  { "zh-CN": "需要服务器与部署经验", en: "Requires server and deployment knowledge" },
  { "zh-CN": "充值与支付路径不统一", en: "Fragmented recharge and payment paths" },
  { "zh-CN": "多模型切换成本高", en: "High overhead to switch models" },
];

export const SKILLS: LocalizedText[] = [
  { "zh-CN": "Memory Core（长期记忆）", en: "Memory Core" },
  { "zh-CN": "Soul Profile（人格风格）", en: "Soul Profile" },
  { "zh-CN": "Daily Briefing（日报简报）", en: "Daily Briefing" },
  { "zh-CN": "Meeting Notes（会议记录）", en: "Meeting Notes" },
  { "zh-CN": "Web Research（网页研究）", en: "Web Research" },
  { "zh-CN": "Content Drafting（内容起草）", en: "Content Drafting" },
  { "zh-CN": "Email Copilot（邮件助手）", en: "Email Copilot" },
  { "zh-CN": "CRM Update（客户信息更新）", en: "CRM Update" },
  { "zh-CN": "Knowledge Base Q&A（知识库问答）", en: "Knowledge Base Q&A" },
  { "zh-CN": "Social Reply Assistant（社媒回复）", en: "Social Reply Assistant" },
  { "zh-CN": "Task Planner（任务规划）", en: "Task Planner" },
  { "zh-CN": "Automation Runner（自动化执行）", en: "Automation Runner" },
  { "zh-CN": "SEO Optimization（SEO 优化）", en: "SEO Optimization" },
  { "zh-CN": "Notion Sync（Notion 同步）", en: "Notion Sync" },
  { "zh-CN": "GitHub Issue Helper（Issue 助手）", en: "GitHub Issue Helper" },
];

export const FAQS: Array<{ question: LocalizedText; answer: LocalizedText }> = [
  {
    question: {
      "zh-CN": "真的不需要我自己准备 API Key 吗？",
      en: "Do I really not need to prepare my own API key?",
    },
    answer: {
      "zh-CN": "MVP 阶段默认无需用户自行配置 API Key，平台会管理底层模型连接。",
      en: "In this MVP, users do not need to configure API keys. The platform manages model connectivity.",
    },
  },
  {
    question: {
      "zh-CN": "为什么聊天软件都标注 Beta？",
      en: "Why are all chat channels marked Beta?",
    },
    answer: {
      "zh-CN": "当前为验证阶段，我们先开放意向选择并逐步灰度接入。",
      en: "This is a validation phase. We collect preferences first, then roll out channel integrations gradually.",
    },
  },
  {
    question: {
      "zh-CN": "选了模型就一定会固定用这个模型吗？",
      en: "Will my selected models always be fixed?",
    },
    answer: {
      "zh-CN": "模型品牌属于目标偏好，实际可用性会受区域和供应商状态影响。",
      en: "Selected model brands represent preferences. Actual usage may vary by region and provider status.",
    },
  },
  {
    question: {
      "zh-CN": "是否支持退款？",
      en: "Is refund supported?",
    },
    answer: {
      "zh-CN": "退款与服务条款以支付页面和 Terms 为准。",
      en: "Refunds and policies follow the checkout page and Terms.",
    },
  },
];

export const UI_TEXT = {
  heroTitle: {
    "zh-CN": "1 分钟拥有你的 AI Agent",
    en: "Own Your AI Agent in 1 Minute",
  },
  heroSubtitle: {
    "zh-CN": "不懂服务器、不懂 API、不懂模型，也能直接开始。",
    en: "No servers, no APIs, no model ops. Just launch your agent.",
  },
  checkout: {
    "zh-CN": "Start Checkout",
    en: "Start Checkout",
  },
  waitlist: {
    "zh-CN": "Join Waitlist",
    en: "Join Waitlist",
  },
  talkSales: {
    "zh-CN": "Talk to Sales",
    en: "Talk to Sales",
  },
  painTitle: {
    "zh-CN": "普通用户真正卡住的地方",
    en: "Where normal users get blocked",
  },
  builderTitle: {
    "zh-CN": "你的 Agent 规格",
    en: "Configure Your Agent",
  },
  modelTitle: {
    "zh-CN": "选择模型（可多选）",
    en: "Choose Models (Multi-select)",
  },
  channelTitle: {
    "zh-CN": "选择聊天软件（可多选）",
    en: "Choose Chat Channels (Multi-select)",
  },
  planTitle: {
    "zh-CN": "选择套餐",
    en: "Pick a Plan",
  },
  paymentTitle: {
    "zh-CN": "支付方式",
    en: "Payment Methods",
  },
  paymentNote: {
    "zh-CN": "支付为外部安全链接，跳转时会带上你的配置参数。",
    en: "Checkout opens external secure links with your current selections attached.",
  },
  skillsTitle: {
    "zh-CN": "预装 Skills（首发）",
    en: "Preinstalled Skills (Launch Set)",
  },
  faqTitle: {
    "zh-CN": "FAQ 与说明",
    en: "FAQ and Policies",
  },
  compliance: {
    "zh-CN": "注：当前为 MVP 验证阶段，渠道接入状态与模型可用性会动态调整。",
    en: "Note: This MVP is in validation phase. Channel and model availability may change dynamically.",
  },
  finalTitle: {
    "zh-CN": "准备好开始了吗？",
    en: "Ready to Launch?",
  },
  finalSubtitle: {
    "zh-CN": "并列双目标：你可以直接支付，也可以先进入候补名单。",
    en: "Dual-goal flow: pay now or join the waitlist first.",
  },
} satisfies Record<string, LocalizedText>;

export const PAYMENT_LINKS: PaymentLinkMap = {
  starter_20: {
    stripe: process.env.NEXT_PUBLIC_PAY_STRIPE_STARTER_20 ?? "/checkout",
    alipay: process.env.NEXT_PUBLIC_PAY_ALIPAY_STARTER_20 ?? "https://example.com/pay?provider=alipay&tier=starter_20",
    wechatpay:
      process.env.NEXT_PUBLIC_PAY_WECHAT_STARTER_20 ?? "https://example.com/pay?provider=wechatpay&tier=starter_20",
    usdc: process.env.NEXT_PUBLIC_PAY_USDC_STARTER_20 ?? "https://example.com/pay?provider=usdc&tier=starter_20",
  },
  pro_40: {
    stripe: process.env.NEXT_PUBLIC_PAY_STRIPE_PRO_40 ?? "/checkout",
    alipay: process.env.NEXT_PUBLIC_PAY_ALIPAY_PRO_40 ?? "https://example.com/pay?provider=alipay&tier=pro_40",
    wechatpay: process.env.NEXT_PUBLIC_PAY_WECHAT_PRO_40 ?? "https://example.com/pay?provider=wechatpay&tier=pro_40",
    usdc: process.env.NEXT_PUBLIC_PAY_USDC_PRO_40 ?? "https://example.com/pay?provider=usdc&tier=pro_40",
  },
  max_200: {
    stripe: process.env.NEXT_PUBLIC_PAY_STRIPE_MAX_200 ?? "/checkout",
    alipay: process.env.NEXT_PUBLIC_PAY_ALIPAY_MAX_200 ?? "https://example.com/pay?provider=alipay&tier=max_200",
    wechatpay: process.env.NEXT_PUBLIC_PAY_WECHAT_MAX_200 ?? "https://example.com/pay?provider=wechatpay&tier=max_200",
    usdc: process.env.NEXT_PUBLIC_PAY_USDC_MAX_200 ?? "https://example.com/pay?provider=usdc&tier=max_200",
  },
};

export const WAITLIST_LINK = process.env.NEXT_PUBLIC_WAITLIST_URL ?? "https://example.com/waitlist";

export function t(text: LocalizedText, lang: Lang): string {
  return text[lang];
}

export function buildQuery(params: {
  plan: PlanId;
  models: ModelId[];
  channels: ChannelId[];
  lang: Lang;
  source?: string;
  intent?: "waitlist" | "sales";
}): string {
  const searchParams = new URLSearchParams();
  searchParams.set("plan", params.plan);
  searchParams.set("models", params.models.length > 0 ? params.models.join(",") : "none");
  searchParams.set("channels", params.channels.length > 0 ? params.channels.join(",") : "none");
  searchParams.set("lang", params.lang);
  searchParams.set("source", params.source ?? "landing_v1");
  if (params.intent) {
    searchParams.set("intent", params.intent);
  }
  return searchParams.toString();
}

export function withQuery(baseUrl: string, query: string): string {
  return baseUrl.includes("?") ? `${baseUrl}&${query}` : `${baseUrl}?${query}`;
}
