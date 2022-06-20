import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Message, NameChange, PrivateMessage } from './models/event.schema';
import { User } from './models/user.schema';
import { ChatService } from './services/chat.service';

@WebSocketGateway(3001, { cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  constructor(private chatService: ChatService) {}

  @WebSocketServer() 
  private server: Server;
  private logger: Logger = new Logger('ChatGateway');
  private users: Array<User> = [];
  public messages = new Array<Message>();

  afterInit(server: Server) {
    this.logger.log('Init');
  }

  handleConnection(client: Socket) {
    let user: User = {
      socketId: client.id,
      name: client.id
    }
    this.users.push(user);
    this.logger.log('Client connected: ' + user.name);
    client.broadcast.emit("chat", {
      text: client.id + " has joined the chat",
      type: "alert",
      owner: client.id,
      ownerId: client.id,
      ownerColor: "yellow"
    })
    client.emit('init', this.messages.reverse());
    this.server.emit('users', this.users);
  }

  handleDisconnect(client: Socket) {
    let userIndex = this.users.findIndex(user => user.socketId == client.id);
    let user = this.users.splice(userIndex, 1)[0];
    this.logger.log('Client disconnected:', user.name);
    client.broadcast.emit("chat", {
      text: user.name + " has left the chat",
      type: "alert",
      owner: user.name,
      ownerId: client.id,
      ownerColor: "yellow"
    })
    client.broadcast.emit('users', this.users);
  }

  async sendMessage(data) {
    if(this.messages.length > 10) {
      this.messages.splice(10, this.messages.length - 10);
    }
    const message: Message = await this.chatService.createMessage(this.messages, data);
    this.server.emit('chat', message);
  }

  @SubscribeMessage('chat')
  handleChat(client: Socket, @MessageBody() data: Message) {
    this.sendMessage(data);
  }

  @SubscribeMessage('users')
  handleUsersRequest(@ConnectedSocket() client: Socket) {
    client.emit('users', this.users);
  }

  @SubscribeMessage('name-change')
  handleNameChange(@ConnectedSocket()client: Socket, @MessageBody() change: NameChange) {
    let userIndex = this.users.findIndex(user => user.socketId == client.id);
    this.users[userIndex].name = change.name;
    let message = {
      text: change.name + " has joined the chat",
      type: "alert",
      owner: change.name,
      ownerId: client.id,
      ownerColor: change.ownerColor
    }
    client.broadcast.emit('chat', message);
    this.server.emit('users', this.users);
   }

   @SubscribeMessage('private')
   handlePrivateMessage(@ConnectedSocket() client: Socket, @MessageBody() message: PrivateMessage) {
    client.to(message.toId).emit("private", message);
   }
}
