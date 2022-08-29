const socketio = require("socket.io");

class ServerSocket {
  constructor(server) {
    this.sockets = socketio(server);
    this.io = false;
  }
  setNsp = (nsp) => {
    this.nsp = nsp;
    this.io = this.sockets.of(`/${nsp}`);
    return this;
  };
}

ServerSocket.prototype.setConnection = function (callback) {
  this.sockets.of(`/${this.nsp}`).on("connection", (socket) => {
    callback(socket);
  });
  return this;
};

ServerSocket.prototype.on = function (inputObj) {
  const { event, callback, callbefore, query } = inputObj;
  if (callbefore) callbefore(query);
  this.sockets.of(`/${this.nsp}`).on(`${event}`, (data) => {
    callback(data);
  });
  return this;
};

ServerSocket.prototype.emit = function (inputObj) {
  const { event, callbefore, query, ...data } = inputObj;
  if (callbefore) callbefore(query);
  this.sockets.of(`/${this.nsp}`).emit(`${event}`, data);
  return this;
};

ServerSocket.prototype.asyncEmit = async function (inputObj) {
  const { event, callbefore, query, ...data } = inputObj;
  if (callbefore) await callbefore(query);
  this.sockets.of(`/${this.nsp}`).emit(`${event}`, data);
  return this;
};

ServerSocket.prototype.toEmit = function (inputObj) {
  const { to, event, callbefore, query, ...data } = inputObj;
  if (to === "all") {
    this.sockets.of(`/${this.nsp}`).broadcast.emit(`${event}`, data);
    return this;
  } else {
    to.forEach((element) => {
      this.sockets.of(`/${this.nsp}`).to(element).emit(`${event}`, data);
    });
    return this;
  }
};
module.exports = ServerSocket;
