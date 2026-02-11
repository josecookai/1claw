import { Context } from 'telegraf';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL ?? 'redis://localhost:6379');
const API_BASE = process.env.API_BASE_URL ?? 'http://localhost:3001/api';
const RATE_KEY = (chatId: string) => `bot:rate:${chatId}`;
const RATE_WINDOW = 1;

export async function handleMessage(ctx: Context) {
  const chatId = String(ctx.chat?.id ?? '');
  const text = (ctx.message as { text?: string })?.text ?? '';

  const key = RATE_KEY(chatId);
  const now = Date.now();
  const windowStart = await redis.get(key);
  if (windowStart) {
    const elapsed = (now - parseInt(windowStart, 10)) / 1000;
    if (elapsed < RATE_WINDOW) {
      await ctx.reply('请稍后再试（限流 1 秒/条）');
      return;
    }
  }
  await redis.set(key, String(now), 'EX', RATE_WINDOW + 1);

  const internalSecret = process.env.INTERNAL_API_SECRET ?? '';
  try {
    const res = await fetch(`${API_BASE}/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(internalSecret ? { 'X-Internal-Secret': internalSecret } : {}),
      },
      body: JSON.stringify({ chatId, message: text, policy: 'BEST' }),
    });
    const data = (await res.json()) as {
      reply?: string;
      error?: string;
      requestId?: string;
    };
    if (data.reply) {
      await ctx.reply(`${data.reply}（requestId=${data.requestId ?? '-'}）`);
    } else {
      await ctx.reply(
        `错误：${data.error ?? '未知'}（requestId=${data.requestId ?? '-'}）`,
      );
    }
  } catch {
    await ctx.reply('服务暂时不可用，请稍后再试');
  }
}
