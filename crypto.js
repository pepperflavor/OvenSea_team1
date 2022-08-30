const bcrypt = require("bcrypt");

const REPEAT_NUM = 50;

const encrypt = function (pwd, encrypted) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(pwd, REPEAT_NUM, (err, hashedPwd) => {
      resolve(hashedPwd);
    });
  });
};

const compare = function (pwd, encrypted) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pwd, encrypted, (err, same) => {
      if (!err) resolve(same);
      reject(err);
    });
  });
};
module.exports = { encrypt, compare };
