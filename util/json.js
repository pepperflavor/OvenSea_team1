class Json {
  constructor(initJSON) {
    const string = `${initJSON}`;
    this.original = [];
    // if (initJSON) this.original = JSON.parse(string);
    if (typeof initJSON === "string") this.original = JSON.parse(initJSON);
    else if (typeof initJSON === "object") this.original = initJSON;
  }
}

Json.prototype.bind = function (callback) {
  return callback(this);
};

Json.prototype.isEmpty = function () {
  if (this.original.length === 1) {
    const result = Object.values(this.original[0]).map((value) => {
      if (value == "") return true;
    });
    return result[0];
  }
  return false;
};

/**
 * @param {string[]}
 * @returns {this}
 */
Json.prototype.initJson = function (obj) {
  this.original = [obj];
  return this;
};

/**
 * @returns {String}
 */
Json.prototype.jsontoString = function () {
  return JSON.stringify(this.original);
};

Json.prototype.push = function (data) {
  console.log(this.original);
  this.original.push(data);
  // if (!data.length) {
  //   this.original.push(data);
  // } else {
  //   const datas = { data };
  //   console.log(datas);
  //   datas.forEach((data) => this.original.push(data));
  // }
  return { afterLength: this.original.length, after: this.original };
};

/**
 * @param {object}
 * @returns {object}
 */
Json.prototype.find = function (callback) {
  const copyObj = { ...this.obj };
  let idx;
  if (this.original.findIndex) idx = this.original.findIndex(callback);

  const isExist = idx > -1 ? true : false;

  const value = isExist ? { ...this.original[idx] } : "";

  return { isExist, idx, value };
};

// input_data: {"user":"Ab01r19240"} { name: "Ab01r19240", user: 111 }
// [{user:12312},{user:12323}]

/**
 *
 * @param {object} input_data
 * @returns
 */
Json.prototype.delete = function (input_data) {
  let sameIdx;
  let isDelete;
  for (const [key, value] of Object.entries(input_data)) {
    sameIdx = this.original.findIndex((data) => {
      return data[key] == value;
    });
    isDelete = sameIdx > -1 ? true : false;
    if (isDelete) {
      this.original.splice(sameIdx, 1);
    }
  }
  return { isDelete, idx: sameIdx, after: [...this.original] };
};
Json.prototype.length = function () {
  return this.original.length;
};
