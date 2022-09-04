const jwt = require("jsonwebtoken");
const { User } = require("../model");
const { ACCESS_TOKEN, REFRESH_TOKEN, ERR } = require("../config/config");
const { ONE_DAY, ONE_WEEK } = require("../model/constants");
require("dotenv").config();

const EXPIRE = { ONE_DAY: "2w", ONE_WEEK: "2w" };
// const EXPIRE = { ONE_DAY: "1d", ONE_WEEK: "1w" };

/**
 * @param {Object} payload
 * @param {String} expiresIn
 * @returns
 */
module.exports = {
  sign: (user, token_type = "access", expiresIn = EXPIRE.ONE_DAY) => {
    const { pwd, iat, exp, id, email, grade, createdAt, updatedAt, ...otherUserData } = user;
    const payload = { ...otherUserData }; // { uid };
    const secretKey = token_type === "access" ? ACCESS_TOKEN : REFRESH_TOKEN;
    
    return jwt.sign(payload, secretKey, {
      algorithm: "HS256",
      expiresIn,
    });
  },

  verify: (token, token_type = "access") => {
    const secretKey = token_type === "access" ? ACCESS_TOKEN : REFRESH_TOKEN;
    try {
      const verifyResult = jwt.verify(token, secretKey);
      if (!verifyResult) throw Error(ERR.ACCESS_TOKEN_NOTVERIFY);
      return {
        ok: true,
        user: verifyResult,
      };
    } catch (error) {
      return {
        ok: false,
        msg: error.message,
      };
    }
  },
  refresh: (expiresIn = EXPIRE.ONE_WEEK) => {
    const secretKey = REFRESH_TOKEN;
    return jwt.sign({}, secretKey, {
      algorithm: "HS256",
      expiresIn,
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
