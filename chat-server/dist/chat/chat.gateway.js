"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./services/chat.service");
let ChatGateway = class ChatGateway {
    constructor(chatService) {
        this.chatService = chatService;
        this.logger = new common_1.Logger('ChatGateway');
        this.users = [];
        this.messages = new Array();
    }
    afterInit(server) {
        this.logger.log('Init');
    }
    handleConnection(client) {
        let user = {
            socketId: client.id,
            name: client.id
        };
        this.users.push(user);
        this.logger.log('Client connected: ' + user.name);
        client.broadcast.emit("chat", {
            text: client.id + " has joined the chat",
            type: "alert",
            owner: client.id,
            ownerId: client.id,
            ownerColor: "yellow"
        });
        client.emit('init', this.messages.reverse());
        this.server.emit('users', this.users);
    }
    handleDisconnect(client) {
        let userIndex = this.users.findIndex(user => user.socketId == client.id);
        let user = this.users.splice(userIndex, 1)[0];
        this.logger.log('Client disconnected:', user.name);
        client.broadcast.emit("chat", {
            text: user.name + " has left the chat",
            type: "alert",
            owner: user.name,
            ownerId: client.id,
            ownerColor: "yellow"
        });
        client.broadcast.emit('users', this.users);
    }
    async sendMessage(data) {
        if (this.messages.length > 10) {
            this.messages.splice(10, this.messages.length - 10);
        }
        const message = await this.chatService.createMessage(this.messages, data);
        this.server.emit('chat', message);
    }
    handleChat(client, data) {
        this.sendMessage(data);
    }
    handleUsersRequest(client) {
        client.emit('users', this.users);
    }
    handleNameChange(client, change) {
        let userIndex = this.users.findIndex(user => user.socketId == client.id);
        this.users[userIndex].name = change.name;
        let message = {
            text: change.name + " has joined the chat",
            type: "alert",
            owner: change.name,
            ownerId: client.id,
            ownerColor: change.ownerColor
        };
        client.broadcast.emit('chat', message);
        this.server.emit('users', this.users);
    }
    handlePrivateMessage(client, message) {
        client.to(message.toId).emit("private", message);
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('chat'),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleChat", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('users'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleUsersRequest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('name-change'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handleNameChange", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('private'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], ChatGateway.prototype, "handlePrivateMessage", null);
ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(3001, { cors: true }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
exports.ChatGateway = ChatGateway;
//# sourceMappingURL=chat.gateway.js.map