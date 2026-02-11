"use client";

import { FormEvent, useState } from "react";

type Props = {
  lang: "zh" | "en";
};

export default function WaitlistForm({ lang }: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), lang, source: "landing_waitlist" }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "FAILED");
      }
      setStatus("success");
      setMessage(lang === "zh" ? "已加入候补，我们会邮件通知你。" : "You're on the waitlist. We'll email you.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage(lang === "zh" ? "提交失败，请稍后重试。" : "Failed to subscribe. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-4 flex w-full max-w-xl flex-col gap-2 sm:flex-row">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={lang === "zh" ? "输入你的邮箱" : "Enter your email"}
        className="h-11 flex-1 rounded-full border border-black/15 bg-white px-4 text-sm outline-none focus:border-black"
        required
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-11 rounded-full bg-black px-5 text-sm font-medium text-white disabled:opacity-60"
      >
        {status === "loading" ? (lang === "zh" ? "提交中..." : "Submitting...") : lang === "zh" ? "加入候补" : "Join waitlist"}
      </button>
      {message ? <p className="w-full text-xs text-black/65 sm:mt-2">{message}</p> : null}
    </form>
  );
}
