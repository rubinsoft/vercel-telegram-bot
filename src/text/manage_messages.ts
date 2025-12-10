import { Context } from 'telegraf';
import createDebug from 'debug';
import { roll } from '../commands';
import { fwToAdmin } from '../commands';

const debug = createDebug('bot:manageMessages_text');
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || null;

const replyToMessage = (ctx: Context, messageId: number, string: string) =>
  ctx.reply(string, {
    reply_parameters: { message_id: messageId },
  });

const manageMessages = () => async (ctx: Context) => {
  debug('Triggered "manageMessages" text command');

  const messageId = ctx.message?.message_id;
  const messageText = ctx.text;
  const userName = `${ctx.message?.from.first_name}`;

  //if the message is a reply and it is from admin, send a message to the original sender
  if (ctx.chat?.id.toString() === ADMIN_CHAT_ID) {
    const message = ctx.message;
    if (message && ("reply_to_message" in message) ) {
      const originalSenderId = message.reply_to_message?.from?.id;
      const replyText = ctx.text || '';
      console.log(`Admin replied to message from user ID ${originalSenderId} with text: ${replyText}`);
      //ctx.sendMessage(originalSenderId || 0, `Admin reply: ${replyText}`);
      ctx.telegram.sendMessage(originalSenderId || 0, `Admin reply: ${replyText}`);
      return;
    }
  }

  //check if it is a roll command or message has roll syntax (roll syntax may start with "/") 
  if(messageText?.toLowerCase().startsWith('roll ') || messageText?.toLowerCase().startsWith('r ') || /^(\/)?(\d+)?d(\d+)(d(\d+))?$/i.test(messageText || '')) {
    await roll()(ctx);
    return;
  }
  //if message is not a roll command, reply with a help message and fw to admin
  if (messageId) {
    console.log(`Managing message from ${ctx.message?.from.username}: ${messageText}`);
    await replyToMessage(ctx, messageId, `Hello, ${userName}!. Write /help for the commands list`);
    fwToAdmin()(ctx);
  }
};

export { manageMessages };
