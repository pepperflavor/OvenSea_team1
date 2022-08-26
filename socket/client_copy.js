class ClientSocket {
  constructor(nsp) {
    this.nsp = nsp;
  }
  async init() {
    this.io = io(`/${this.nsp}`);
    console.log(this.nsp);
    await this.connect();
  }
}

// obj = {type:"connect", inputObj}
ClientSocket.prototype.connect = function () {
  return new Promise(async (resolve, reject) => {
    this.io.on("connect", (socket) => {
      resolve(true);
    });
  });
};
// obj = {type:"connect", inputObj}
ClientSocket.prototype.on = function (obj, callback) {
  const nsp = this.nsp
  const { type, ...data } = obj;
  console.log(`@@@@@@@@@@@@@@@${this.nsp}_${type}`);
  this.io.on(`${nsp}_${type}`, (data) => callback(data));
  return this;
};
// obj = {type:"connect", inputObj}
ClientSocket.prototype.emit = function (obj) {
  const nsp = this.nsp
  const { type, ...data } = obj;
  console.log(`${nsp}_${type}`, data);
  this.io.on(`${nsp}_${type}`, data);
  return this;
};

const auction = new ClientSocket("auction");
auction.init();
auction.on({ type: "뀨" }, (data) => {
  console.log("뀨 이미터 전소옹!", data);
});

setInterval(() => {
  auction.emit({ type: "뀨", room: "뀨" });
},500);
