const socketio = require("socket.io");

class ServerSocket {
  constructor(server) {
    this.io = socketio(server);
    this.socketList = {};
    this.socketConnection = {};
    this.to = [];
  }
  getSockets = () => this.socketList;
  getConnection = () => this.socketConnection;
}
ServerSocket.prototype.setSockets = function (socketNsp, callback) {
  this.io.of(`/${socketNsp}`).on("connection", (socket) => {
    this.socketList[socketNsp] = socket;
    callback(socket);
  });
  return this;
};

ServerSocket.prototype.on = function (inputObj) {
  const { nsp, emit, callback, callbefore, query } = inputObj;
  if (callbefore) callbefore(query);
  this.socketList[nsp].on(`${emit}`, (data) => {
    callback(data);
  });
  return this;
};

ServerSocket.prototype.emit = function (inputObj) {
  const { nsp, emit, callbefore, query, ...data } = inputObj;
  if (callbefore) callbefore(query);
  this.socketList[nsp].emit(`${emit}`, data);
  return this;
};

ServerSocket.prototype.asyncEmit = async function (inputObj) {
  const { nsp, emit, callbefore, query, ...data } = inputObj;
  if (callbefore) await callbefore(query);
  this.socketList[nsp].emit(`${emit}`, data);
  return this;
};

ServerSocket.prototype.toEmit = function (inputObj) {
  const { nsp, to, emit, callbefore, query, ...data } = inputObj;
  if (to !== "all") {
    to.forEach((sendTo) => {
      this.socketList[nsp].to(sendTo).emit(`${emit}`, data);
    });
  } else{
    this.socketList[nsp].broadcast.emit(`${emit}`, data);
  }
};

module.exports = ServerSocket;
