const jwt = require("jsonwebtoken");
const { User } = require("../model");
const { ACCESS_TOKEN, REFRESH_TOKEN, ERR } = require("../config/config");
require("dotenv").config();
const ONE_DAY = 24 * 60 * 60 * 1000;

/**
 * @param {Object} payload
 * @param {String} expiresIn
 * @returns
 */
module.exports = {
  sign: (user, token_type = "access", expiresIn = "5m") => {
    const payload = {
      id: user.id,
    };
    const secretKey = token_type === "access" ? ACCESS_TOKEN : REFRESH_TOKEN;
    return jwt.sign(payload, secretKey, {
      algorithm: "HS256",
      expiresIn: expiresIn,
    });
  },

  verify: (token, token_type = "access") => {
    const secretKey = token_type === "access" ? ACCESS_TOKEN : REFRESH_TOKEN;
    try {
      const verifyResult = jwt.verify(token, secretKey);
      if (!verifyResult) throw Error(ERR.ACCESS_TOKEN_NOTVERIFY);
      return {
        ok: true,
        uid: verifyResult.uid,
      };
    } catch (error) {
      return {
        ok: false,
        msg: error.message,
      };
    }
  },
  refresh: () => {
    const secretKey = REFRESH_TOKEN;
    return jwt.sign({}, secretKey, {
      algorithm: "HS256",
      expiresIn: "14d",
    });
  },

  refreshVerify: async (token, userUid) => {
    try {
      const user = await User.findOne({ where: { uid: userUid } });
      if (!user?.dataValues) throw Error(ERR.DB_USER_NOTFOUND);

      const { refresh_token } = user?.dataValues;

      const ok = jwt.verify(token, refresh_token);
      if (!ok) throw Error(ERR.REFRESH_TOKEN_NOTVERIFY);

      return { ok, msg: "good" };
    } catch (error) {
      return {
        ok: false,
        msg: error.message,
        code: ERR.REFRESH_TOKEN_NOTVERIFY,
      };
    }
  },
};
