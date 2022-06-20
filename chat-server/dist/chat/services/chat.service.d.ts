import { Message } from '../models/event.schema';
export declare class ChatService {
    constructor();
    createMessage(messages: Array<Message>, message: Message): Promise<Message>;
}
