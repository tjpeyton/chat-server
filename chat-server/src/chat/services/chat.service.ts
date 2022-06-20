import { Injectable } from '@nestjs/common';
import { Message } from '../models/event.schema';

@Injectable()
export class ChatService {
  constructor() {}

  public createMessage(messages: Array<Message>, message: Message): Promise<Message> {
    if(messages[10] != null) messages.unshift(message);
    else {
      messages[10] == null;
      messages.unshift(message);
    }
    return Promise.resolve(message);
  }
}
