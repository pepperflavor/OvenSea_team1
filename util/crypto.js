const bcrypt = require("bcrypt");

const REPEAT_NUM = 10;

const encrypt = function (pwd) {
  
  return new Promise((resolve, reject) => {
    bcrypt.hash(pwd, REPEAT_NUM, (err, hashedPwd) => {
      if (err) reject(err)
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
