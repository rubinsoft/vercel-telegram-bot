import { Context } from 'telegraf';
import createDebug from 'debug';

const debug = createDebug('bot:debug_command');

const debugFn = () => async (ctx: Context) => {
  debug(`Triggered "debug" command.`);
  if(ctx.message?.from.username !== 'firebone') {
    //await ctx.reply('You are not authorized to use this command (' + ctx.message?.from.username + ')');
    return;
  }
  //transform ctx to string
  
  const message = JSON.stringify(ctx.from, null, 2);
  await ctx.reply(message);
  const message2 = JSON.stringify(ctx.chat, null, 2);
  await ctx.reply(message2);
};

export { debugFn };
