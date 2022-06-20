const io = require('socket.io-client');
var readline = require('readline');
var colors = require("colors");

const userService = require("./services/user.service");
const chatService = require("./services/chat.service");

const socket = io("http://localhost:3001");
var connectedUsers = [];
var user = {};

function processCommand(cmd, arg) {
  switch(cmd) {
    case 'name':
      user.name = userService.changeName(arg, user, socket);
      break;
    case 'userc':
      userService.displayUserCount(connectedUsers);
      break;
    case 'users':
      userService.displayUsers(connectedUsers);
      break;
    case 'color':
      userService.changeUserColor(arg, user);
      break;
    case 'private':
      chatService.sendPrivateMessage(arg, socket, connectedUsers, user);
      break;
    case 'help':
      chatService.displayCommandHelp();
      break;
    case 'exit':
      exitClient();
      break;
    default:
      console.log("Invalid command".red);
  }
}

function exitClient() {
  socket.close();
  rl.close();
  process.exit();
}

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', (line) => {
  if(line[0] == "/" && line.length > 1) {
    var cmd = line.match(/[a-z]+\b/)[0];
    var arg = line.substring(cmd.length + 2, line.length);
    processCommand(cmd, arg)
  } else {
    chatService.sendMessage(line, "message", socket, user);
  }
  rl.prompt();
});

socket.on("connect", () => {
  console.log("connected to chat".green);
  console.log("")
});

socket.on("disconnect", () => {
  console.log("disconnected from chat".red);
  console.log("");
});

/**
 * General chat room
 */
socket.on("chat", (message) => {
  if(socket.id != message.ownerId || message.type == "alert") chatService.logChat(message, rl);
});

/**
 * Private messages
 */
socket.on("private", (pMessage) => {
  chatService.logChat(pMessage, rl);
})

socket.on("init", (messages) => {
  user.name = socket.id;
  user.color = "yellow";
  user.socketId = socket.id;
  console.log("Hello, " + user.name);
  console.log("Change your name by prefacing your message with /name ");
  console.log("enter /help for more information on available commands");
  console.log("");
  rl.prompt();
  for(let message of messages) {
    if(message) chatService.logChat(message, rl);
  }
});

/**
 * Retrieve updated user array from the server
 */
socket.on("users", (users) => {
  connectedUsers = users;
});
