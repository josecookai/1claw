export type WaitlistLead = {
  email: string;
  lang: "zh" | "en";
  source: string;
  createdAt: string;
};

export async function saveWaitlistLead(lead: WaitlistLead) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return { ok: true, mode: "noop" as const };
  }

  const key = `waitlist:${lead.email.toLowerCase()}`;
  const setRes = await fetch(`${url}/set/${encodeURIComponent(key)}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(JSON.stringify(lead)),
  });

  if (!setRes.ok) {
    const details = await setRes.text();
    return { ok: false, mode: "upstash" as const, details };
  }

  await fetch(`${url}/sadd/waitlist:emails/${encodeURIComponent(lead.email.toLowerCase())}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  return { ok: true, mode: "upstash" as const };
}

export async function sendWaitlistConfirmationEmail(email: string, lang: "zh" | "en") {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WAITLIST_FROM_EMAIL;
  if (!apiKey || !from) return { ok: true, mode: "skip" as const };

  const subject = lang === "zh" ? "欢迎加入 1Claw 候补名单" : "Welcome to 1Claw waitlist";
  const text =
    lang === "zh"
      ? "已收到你的申请。我们会在开放名额时第一时间通知你。"
      : "You're on the waitlist. We will notify you as soon as access opens.";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      text,
    }),
  });

  if (!res.ok) {
    return { ok: false, mode: "resend" as const, details: await res.text() };
  }
  return { ok: true, mode: "resend" as const };
}
