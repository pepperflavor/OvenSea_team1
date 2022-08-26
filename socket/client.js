class ClientSocket {
  constructor() {
    this.nsp = {};
    this.curr = null;
  }

  initAuction(dataObj) {
    const nspName = "auction";
    this.setNsp(nspName)
      .connect(nspName)
      .then((nspName) => {
        this.sendEmit({
          nsp: "auction",
          emit: "join",
          ...dataObj,
        });
      });
  }
  initChat(dataObj) {
    const nspName = "chat";
    this.setNsp(nspName)
      .connect(nspName)
      .then((nspName) => {
        this.sendEmit({
          nsp: "chat",
          emit: "join",
          ...dataObj,
        });
      });
  }
  initEvent(dataObj) {
    const nspName = "event";
    this.setNsp(nspName)
      .connect(nspName)
      .then((nspName) => {
        this.sendEmit({
          nsp: "event",
          emit: "join",
          ...dataObj,
        });
      });
  }

  /**
   *
   * @param {String} name
   * @returns {ClientSocket}
   */
  setNsp = (name) => {
    this.nsp[name] = io(`/${name}`);
    this.curr = name;
    return this;
  };

  /**
   *
   * @returns {Object}
   */
  getNsp = () => {
    return this.nsp;
  };

  /**
   *
   * @param {String} name
   * @returns {Promise}
   */
  connect = (name) => {
    return new Promise((resolve, reject) => {
      this.nsp[name].on("connect", () => {
        resolve(name);
      });
    });
  };

  // dataObj = {emit, ...input}
  sendEmit = (dataObj) => {
    const { nsp, emit, ...inputData } = dataObj;
    console.log(`${emit}_${nsp}`, inputData);
    this.nsp[nsp].emit(`${emit}_${nsp}`, inputData);
  };

  // connectAuction(room) {
  //   this.nsp["auction"] = io("/auction");
  //   this.nsp["auction"].on("connect", (socket) => {
  //     this.nsp["auction"].emit("joinAuction", "옥션룸", "uid 나나나");
  //   });
  //   this.nsp["auction"].on("join_auction", () => {
  //     console.log("엣헴");
  //   });
  //   this.nsp["auction"].on("leave_auction", () => {
  //     console.log("엣헴");
  //   });
  // }

  registerEmit = () => {};
}
