import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "1Claw | Own Your AI Agent in 1 Minute",
  description:
    "1Claw MVP landing page for OpenClaw as a Service. Pick models, channels, pricing, and checkout in one flow.",
  openGraph: {
    title: "1Claw | Own Your AI Agent in 1 Minute",
    description:
      "No servers, no API setup. Select your stack and launch your AI agent workflow in under a minute.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
