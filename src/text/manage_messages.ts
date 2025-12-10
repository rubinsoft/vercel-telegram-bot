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

const checkAdminMessage = (ctx: Context) => {
  if (ctx.chat?.id.toString() === ADMIN_CHAT_ID) {
    let message = ctx.message;
    if (message && ("reply_to_message" in message)) {
      let replymessage = message.reply_to_message;
      //const originalSenderId = JSON.stringify(message.reply_to_message);
      //console.log(originalSenderId);
      let replyText = ctx.text || '';
      //const replyToMessageId = message.reply_to_message?.message_id || '';
      let originalSenderId = 0;
      if (replymessage && ("forward_origin" in replymessage)) {
        let fwOrigin = replymessage.forward_origin;
        if (fwOrigin && ("sender_user" in fwOrigin)) {
          originalSenderId = fwOrigin.sender_user.id;
        }
      }
      console.log(`Admin replied to message from user ID ${originalSenderId} with text: ${replyText}`);
      //ctx.sendMessage(originalSenderId || 0, `Admin reply: ${replyText}`);
      ctx.telegram.sendMessage(originalSenderId || 0, `*Admin reply*: ${replyText}`, {
        parse_mode: 'MarkdownV2'
        //,reply_parameters: { message_id: messageId || 0 }
      }).then(() => {
        console.log("Message sent to original sender");
      }).catch((error) => {
        console.error("Error sending message to original sender:", error);
      });
      return true;
    }
  }
  return false;
};

const manageMessages = () => async (ctx: Context) => {
  debug('Triggered "manageMessages" text command');

  //skip if from bot
  if (ctx.message?.from?.is_bot) {
    console.info(`Ignoring message from bot user: ${ctx.message.from.username}`);
    return;
  }

  //if the message is a reply and it is from admin, send a message to the original sender
  let isAdminMessage = checkAdminMessage(ctx);
  if (isAdminMessage) {
    return;
  }

  const messageId = ctx.message?.message_id;
  var messageText = ctx.text;
  const userName = `${ctx.message?.from.first_name}`;

  //remove @RPGdiceBot from text message
  if (messageText && messageText.endsWith('@RPGdicesBot')) {
    messageText = messageText.replace('@RPGdicesBot', '').trim();
  }

  //check if it is a roll command or message has roll syntax (roll syntax may start with "/") 
  if (messageText && messageText?.toLowerCase().startsWith('roll ') || messageText?.toLowerCase().startsWith('r ') || /^(\/)?(\d+)?d(\d+)(d(\d+))?$/i.test(messageText || '')) {
    await roll()(ctx);
    return;
  }
  //if message is not a roll command, reply with a help message and fw to admin
  if (messageId) {
    console.log(`Managing message from ${ctx.message?.from.username}: ${messageText}`);
    await replyToMessage(ctx, messageId, `Hello, ${userName}!. Write /help for the commands list`);
    await fwToAdmin()(ctx);
  }
};

export { manageMessages };
