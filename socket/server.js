const socketio = require("socket.io");

class ServerSocket {
  constructor(server) {
    this.io = socketio(server);
    this.nsp = {
      auction: this.io.of("/auction"),
      event: this.io.of("/event"),
      chat: this.io.of("/chat"),
    };
    this.init();
    this.initSocket("auction");
    this.initSocket("chat");
    this.initSocket("event");
  }

  init() {
    this.io.on("connection", (socket) => {
      console.log("Socket 작동중");
    });
  }

  initSocket(nspName) {
    this.nsp[`${nspName}`].on("connection", (socket) => {
      socket.on(`join_${nspName}`, (dataObj) => {
        const { room, uid } = dataObj;
        socket.join(room);
        socket.to(room).emit(`join_${nspName}`, room, uid);
        console.log(`${nspName} UID:${uid} 입장`);
      });

      socket.on(`leave_${nspName}`, (dataObj) => {
        const { room, uid } = dataObj;
        socket.leave(room);
        io.to(room).emit(`leave_${nspName}`, room, uid);
        console.log(`${nspName} UID:${uid} 퇴장`);
      });
    });
  }
  registerOn = (inputObj, callback) => {
    callback(inputObj)
  };
  
  
}

module.exports = ServerSocket;
