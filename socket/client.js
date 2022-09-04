class ClientSocket {
  constructor(nsp) {
    this.io = io(`/${nsp}`);
    this.nsp = nsp;
  }
}

ClientSocket.prototype.setConnection = function (callback) {
  this.io.on(`connect`, (socket) => {
    this.nsp = socket;
    callback(socket);
  });
  return this;
};

ClientSocket.prototype.on = function (inputObj) {
  const { event, callback, callbefore, query } = inputObj;
  if (callbefore) callbefore(query);
  this.io.on(`${event}`, (data) => {
    callback(data);
  });
  return this;
};

ClientSocket.prototype.emit = function (inputObj) {
  const { event, callbefore, query, ...data } = inputObj;
  console.log(data)
  if (callbefore) callbefore(query);
  this.io.emit(`${event}`, data);
  return this;
};

ClientSocket.prototype.asyncEmit = async function (inputObj) {
  let result = "";
  const { event, callbefore, query, ...data } = inputObj;
  if (callbefore) {
    result = await callbefore(query);
  }
  this.io.emit(`${event}`, data, result);
  return this;
};

ClientSocket.prototype.toEmit = function (inputObj) {
  const { to, event, callbefore, query, ...data } = inputObj;
  if (to === "all") {
    this.io.broadcast.emit(`${event}`, data);
  } else {
    to.forEach((element) => {
      this.io.to(element).emit(`${event}`, data);
    });
  }

  return this;
};
