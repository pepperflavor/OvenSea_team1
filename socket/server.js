const socketio = require("socket.io");

class ServerSocket {
  constructor(sockets, nsp) {
    this.sockets = sockets;
    this.nsp = nsp;
    this.io = this.sockets.of(`/${this.nsp}`);
    this.connectionSocket;
  }
}

ServerSocket.prototype.setConnection = function (callback) {
  this.io.on("connection", (socket) => {
    this.connectionSocket = socket;
    callback(socket);
  });
  return this;
};

ServerSocket.prototype.on = function (inputObj) {
  const { event, callback, callbefore, query } = inputObj;
  if (callbefore) callbefore(query);
  this.connectionSocket.on(event, (data) => {
    callback(data);
  });
  return this;
};

ServerSocket.prototype.emit = function (inputObj) {
  try {
    const { event, callbefore, query, ...data } = inputObj;
    if (callbefore) callbefore(query);
    this.connectionSocket.emit(event, data);
    return this;
  } catch (error) {}
};

ServerSocket.prototype.asyncEmit = async function (inputObj) {
  const { event, callbefore, query, ...data } = inputObj;
  if (callbefore) await callbefore(query);
  this.connectionSocket.emit(event, data);
  return this;
};

ServerSocket.prototype.toEmit = function (inputObj) {
  try {
    const { to, event, callbefore, query, ...data } = inputObj;
    if (to === "all") {
      this.connectionSocket.broadcast.emit(event, data);
      return this;
    } else {
      to.forEach((element) => {
        this.connectionSocket.to(element).emit(event, data);
      });
      return this;
    }
  } catch (error) {
    console.log(error);
  }
};
module.exports = ServerSocket;
