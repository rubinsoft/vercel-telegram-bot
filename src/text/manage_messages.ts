import { Context } from 'telegraf';
import createDebug from 'debug';
import { roll } from '../commands';

const debug = createDebug('bot:manageMessages_text');

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
  });

const manageMessages = () => async (ctx: Context) => {
  debug('Triggered "manageMessages" text command');

  const messageId = ctx.message?.message_id;
  const messageText = ctx.text;
  const userName = `${ctx.message?.from.first_name}`;

  //check if it is a roll command or message has roll syntax
  if(messageText?.toLowerCase().startsWith('roll ') || messageText?.toLowerCase().startsWith('r ') || /^(\d+)?d(\d+)(d(\d+))?$/i.test(messageText || '')) {
    await roll()(ctx);
    return;
  }
  if (messageId) {
    await replyToMessage(ctx, messageId, `Hello, ${userName}!. Write /help for the commands list`);
  }
};

export { manageMessages };
