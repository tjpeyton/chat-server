import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, NameChange, PrivateMessage } from './models/event.schema';
import { ChatService } from './services/chat.service';
export declare class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    private chatService;
    constructor(chatService: ChatService);
    private server;
    private logger;
    private users;
    messages: Message[];
    afterInit(server: Server): void;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    sendMessage(data: any): Promise<void>;
    handleChat(client: Socket, data: Message): void;
    handleUsersRequest(client: Socket): void;
    handleNameChange(client: Socket, change: NameChange): void;
    handlePrivateMessage(client: Socket, message: PrivateMessage): void;
}
