const config = require("../config");
var colors = require("colors");

function changeUserColor(color, user) {
  if(config.colorList.includes(color)) user.color = color;
  else console.log("Not a valid color. Enter /help for a list of available colors".red);
}

function changeName(name, user, socket) {
  let body = {
    name: name,
    ownerColor: user.color
  }
  socket.emit('name-change', body);
  return name;
}

function displayUserCount(connectedUsers) {
  let message = "Users online: " + connectedUsers.length;
  console.log(message.yellow);
}

function displayUsers(connectedUsers) {
  console.log("*****Users Online*****".yellow);
  for(let user of connectedUsers) {
    console.log(user.name.yellow);
  }
  console.log("");
}

function findConnectedUserId(user, connectedUsers) {
  let target = connectedUsers.find(usr => {
    return usr.name == user;
  });
  if(target) return target.socketId;
  else return null;
}

module.exports = {
  changeUserColor,
  changeName,
  displayUserCount,
  displayUsers,
  findConnectedUserId
}
