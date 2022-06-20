import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './services/chat.service';

@Module({
  providers:[ChatGateway, ChatService],
  exports: [ChatService],
  imports: []
})
export class ChatModule {}
