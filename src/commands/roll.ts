import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:roll_command');

const roll = () => async (ctx: Context) => {
  const message = `roll command is not yet implemented.`;
  debug(`Triggered "roll" command with message \n${message}`);
  await ctx.replyWithMarkdownV2(message, { parse_mode: 'Markdown' });
};
const r = () => async (ctx: Context) => {
  await roll()(ctx);
};


export { roll, r };
