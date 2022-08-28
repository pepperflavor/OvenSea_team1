class ClientSocket {
  constructor(nsp) {
    this.io = io(`/${nsp}`);
  }
}
ClientSocket.prototype.on = function (inputObj) {
  const { emit, callback, callbefore, query } = inputObj;
  if (callbefore) callbefore(query);
  this.io.on(`${emit}`, (data) => {
    callback(data);
  });
  return this;
};

ClientSocket.prototype.emit = function (inputObj) {
  const { emit, callbefore, query, ...data  } = inputObj;
  if (callbefore) callbefore(query);
  this.io.emit(`${emit}`, data);
  return this;
};

ClientSocket.prototype.asyncEmit = async function (inputObj) {
  const { emit, callbefore, query, ...data  } = inputObj;
  if (callbefore) await callbefore(query);
  this.io.emit(`${emit}`, data);
  return this;
};


ClientSocket.prototype.toEmit = function (inputObj) {
  const { nsp, to, emit, callbefore, query, ...data } = inputObj;
  if (!this.socketList[nsp]) return;
  to.forEach((element) => {
    this.io.to(element);
  });
  this.io.emit(`${emit}`, data);
};