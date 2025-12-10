import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:debug_command');

const debugFn = () => async (ctx: Context) => {
  if(ctx.message?.from.username !== 'firebone') {
    await ctx.reply('You are not authorized to use this command (' + ctx.message?.from.username + ')');
    return;
  }
  const message = `${ctx}`;
  debug(`Triggered "debug" command.`);
  await ctx.reply(message);
};

export { debugFn };
