const config = require("../config");
var colors = require("colors");

const userService = require("./user.service");

function sendMessage(text, type, socket, user) {
  const message = {
    type: type,
    text: text,
    owner: user.name,
    ownerColor: user.color,
    ownerId: socket.id
  }
  socket.emit("chat", message);
}

function sendPrivateMessage(arg, socket, connectedUsers, user) {
  var to = arg.match(/[a-z]+\b/)[0];
  var text = arg.substring(to.length + 1, arg.length);
  var toUser = userService.findConnectedUserId(to, connectedUsers);
  if(!toUser) {
    console.log("User does not exist, or is not active".red);
    return;
  }
  const pMessage = {
    fromId: socket.id,
    fromName: user.name,
    text: text,
    toId: toUser,
    type: "private"
  }
  socket.emit("private", pMessage);
}

function logChat(message, rl) {
  switch(message.type) {
    case "message":
      let owner = "<" + message.owner + ">:";
      console.log(owner[message.ownerColor] + " " + message.text);
      break;
    case "private":
      let from = "<<" + message.fromName + ">>:";
      console.log(from['green'] + " " + message.text);
      break;
    case "alert":
      console.log(message.text.cyan);
      break;
  }
  rl.prompt();
}

function displayCommandHelp() {
  console.log(config.helpFinal.magenta);
  console.log("")
  console.log(config.stars.magenta);
}

module.exports = {
  displayCommandHelp,
  sendMessage,
  sendPrivateMessage,
  logChat
}
