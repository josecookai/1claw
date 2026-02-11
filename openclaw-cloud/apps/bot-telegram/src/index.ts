import { Telegraf } from 'telegraf';
import { handleBind } from './handlers/bind';
import { handleMessage } from './handlers/message';

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

const bot = new Telegraf(token);

bot.start((ctx) =>
  ctx.reply('Welcome to OpenClaw Bot. Use /bind <code> to link your account.'),
);

bot.command('bind', handleBind);

bot.on('text', handleMessage);

bot.launch().then(() => console.log('Bot started'));
