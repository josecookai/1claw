import { Context } from 'telegraf';

const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3001/api';

export async function handleBind(ctx: Context) {
  const text = (ctx.message as { text?: string })?.text ?? '';
  const match = text.match(/^\/bind\s+(\S+)/);
  if (!match) {
    await ctx.reply('用法: /bind <绑定码>');
    return;
  }
  const bindCode = match[1].trim().toUpperCase();
  const chatId = String(ctx.chat?.id ?? '');

  try {
    const res = await fetch(`${API_BASE}/v1/bind/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bindCode, chatId }),
    });
    const data = (await res.json()) as { ok?: boolean; error?: string };
    if (data.ok) {
      await ctx.reply('绑定成功！');
    } else {
      await ctx.reply('绑定失败：' + (data.error ?? '无效的绑定码'));
    }
  } catch (e) {
    await ctx.reply('绑定失败：服务暂时不可用');
  }
}
