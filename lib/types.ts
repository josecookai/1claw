export type ModelId =
  | "bailian"
  | "hunyuan"
  | "kimi"
  | "glm"
  | "claude"
  | "chatgpt"
  | "gpt-5-2"
  | "gemini-3";

export type ChannelId =
  | "wechat"
  | "feishu"
  | "dingtalk"
  | "telegram"
  | "discord"
  | "slack";

export type PlanId = "starter_20" | "pro_40" | "max_200";
export type Lang = "zh-CN" | "en";

export type LandingSelection = {
  models: ModelId[];
  channels: ChannelId[];
  plan: PlanId;
  lang: Lang;
};

export type PaymentMethod = "stripe" | "alipay" | "wechatpay" | "usdc";
export type PaymentLinkMap = Record<PlanId, Record<PaymentMethod, string>>;

export type LocalizedText = {
  "zh-CN": string;
  en: string;
};
