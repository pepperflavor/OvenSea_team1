class Json {
  constructor(initJSON) {
    const string = `${initJSON}`;
    this.original = [];
    // if (initJSON) this.original = JSON.parse(string);
    if (typeof initJSON === "string") this.original = JSON.parse(initJSON);
    else if (typeof initJSON === "object") this.original = initJSON;
  }
}
/**
 * @param {string[]}
 * @returns {this}
 */
Json.prototype.initJson = function (columnArr) {
  const arr = [];
  columnArr.forEach((column) => {
    const obj = {};
    const defaultValue = "";
    obj[column] = defaultValue;
    arr.push(obj);
  });
  this.original = arr;
  return this;
};

/**
 * @returns {String}
 */
Json.prototype.sendJson = function () {
  return JSON.stringify(this.original);
};

Json.prototype.push = function (data) {
  if (!data.length) {
    this.original.push(data);
  } else {
    const datas = { ...data };
    datas.forEach((data) => this.original.push(data));
  }
  return { afterLength: this.original.length, after: this.original };
};

/**
 * @param {object}
 * @returns {object}
 */
Json.prototype.find = function (callback) {
  const copyObj = { ...this.obj };

  const idx = this.original.findIndex(callback);

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
Json.prototype.toJson = function (input_data) {
  this.original = [...input_data];
  return this;
};

// const test = new Json(
//   '[{"user":"Ab01r19240"},{"user":"G5EtD19240"},{"user":"eEMfJ19240"},{"user":"eEMfJ19240"}]'
// );
// const test1 = new Json([
//   { user: "Ab01r19240" },
//   { user: "G5EtD19240" },
//   { user: "eEMfJ19240" },
//   { user: "eEMfJ19240" },
// ]);

// // console.log();
// test1.toJson(testObj);
// console.log(test1.delete({ user: "eEMfJ19240" }));
// console.log(test1.push({ user: "Ab01r19240" }));
// console.log(test1.push({ user: "Ab01r19240" }));
// console.log(test1.push({ user: "Ab01r19240" }));

// console.log(test1.push({ user: "Ab01r19240" }));
// console.log(test1.delete({ user: "Ab01r19240" }));
// console.log(test1.push({ user: "Ab01r19240" }));
// console.log(typeof test1.sendJson(), test1, test1.sendJson());
// console.log(test1.search(({ user }) => user === "G5E219240"));

module.exports = Json;
