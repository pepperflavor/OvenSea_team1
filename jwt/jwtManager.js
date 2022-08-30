const dot = require("dotenv");
const jwt = require("jsonwebtoken");
dot.config();
const ONE_DAY = 24 * 60 * 60 * 1000;

const { ACCESS_TOKEN, REFRESH_TOKEN } = process.env;

/**
 *
 * @param {Object} payload
 * @param {String} expiresIn
 * @returns
 */
const signAccessToken = function (payload, expiresIn = "5m") {
  jwt.sign({ ...payload }, ACCESS_TOKEN, { expiresIn: expiresIn });
};
/**
 *
 * @param {Object} payload
 * @param {String} expiresIn
 * @returns
 */
const signRefreshToken = function (payload, expiresIn = "1d") {
  jwt.sign({ ...payload }, REFRESH_TOKEN, { expiresIn: expiresIn });
};
const verifyAccessToken = function (accessToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(accessToken, ACCESS_TOKEN, (err, decodedPayloac) => {
      console.log("verifyAccessToken", decodedPayloac);
      console.log("err", err);
      if (!err) resolve(decodedPayloac);
      reject(err);
    });
  });
};

const verifyRefreshToken = function (refToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(refToken, REFRESH_TOKEN, (err, decodedPayloac) => {
      if (!err) resolve(decodedPayloac);
      reject(err);
    });
  });
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

// const access = signAccessToken({
//   uid: "뀨뀨뀨",
//   email: "gasdfsdf@naver.com",
//   url: "/sdfikjsdiof.jpg",
// });

// console.log("암호화된 토큰", access);

// verifyAccessToken(access + "ㄴㅇㄹ너이ㅏ러ㅣㄴㅇㄹ")
//   .then((encoded) => {
//     console.log("then 루트", encoded);
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const test = async function () {
//   const result = await verifyAccessToken(access + "ㄴㅇㄹ너이ㅏ러ㅣㄴㅇㄹ");
//   console.log(result);
// };

// setInterval(() => {
//   verifyAccessToken(access + "ㄴㅇㄹ너이ㅏ러ㅣㄴㅇㄹ")
//     .then((encoded) => {
//       console.log("then 루트", encoded);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }, 500);
