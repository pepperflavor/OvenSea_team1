class requestThrottling {
  constructor(delayTime = 500) {
    this.timer = false;
    this.delayTime = delayTime;
  }
  request = async (datas, callback) => {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(callback(datas), this.delayTime);
  };
}
