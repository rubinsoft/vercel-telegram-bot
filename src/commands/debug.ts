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

const fwToAdmin = () => async (ctx: Context) => {
  const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || null;
  if(ADMIN_CHAT_ID !== null && !ADMIN_CHAT_ID.startsWith('OFF_')) {
    const fromWhereToSendId = ctx.message?.chat.id || 0;
    const whatIdToSend = ctx.message?.message_id || 0;
    console.log(`Forwarding roll command to admin chat ID ${ADMIN_CHAT_ID}, from chat ID ${fromWhereToSendId}, message ID ${whatIdToSend}`);
    if(fromWhereToSendId !== 0 && whatIdToSend !== 0) 
        ctx.telegram.forwardMessage(ADMIN_CHAT_ID, fromWhereToSendId, whatIdToSend);
  }
};

export { debugFn, fwToAdmin };
