import { Context as TelegrafContext } from 'telegraf';
import type { Message as TGMessage } from 'telegraf/types';

export type Message = {
    text?: TGMessage.TextMessage;
    photo?: TGMessage.PhotoMessage;
    video?: TGMessage.VideoMessage;
};

export type Session = {
    messages: Message[];
    mediaGroupIds: string[];
};

export type Context = TelegrafContext & {
    session: Session;
};