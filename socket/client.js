class ClientSocket {
  constructor(nsp) {
    this.io = io(`/${nsp}`);
    this.nsp = nsp;
  }
}
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
  if (callbefore) callbefore(query);
  this.io.emit(`${event}`, data);
  return this;
};

ClientSocket.prototype.asyncEmit = async function (inputObj) {
  const { event, callbefore, query, ...data } = inputObj;
  if (callbefore) await callbefore(query);
  this.io.emit(`${event}`, data);
  return this;
};

ClientSocket.prototype.toEmit = function (inputObj) {
  const { to, event, callbefore, query, ...data } = inputObj;
  if (to === "all") {
    this.io.broadcast.emit(`${event}`, data);
    return this;
  } else {
    to.forEach((element) => {
      this.io.to(element).emit(`${event}`, data);
    });
    return this;
  }
};