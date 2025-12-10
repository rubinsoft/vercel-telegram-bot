import { Telegraf } from 'telegraf';

import { about } from './commands';
import { roll } from './commands';
import { debugFn } from './commands';
import { manageMessages } from './text';
import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot = new Telegraf(BOT_TOKEN);

bot.help((ctx) => {
  ctx.reply(
    'Available commands:\n/about - Information about the bot\n/roll XdY or /roll XdYdZ - Roll X dice with Y faces (and difficulty Z)\n/r XdY or /r XdYdZ - Shortcut for /roll',
  );
});
bot.command('about', about());
bot.command('debug', debugFn());
bot.command('roll', roll());
bot.command('r', roll());
bot.on('message', manageMessages());


//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
