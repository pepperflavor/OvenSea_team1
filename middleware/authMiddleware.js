require("dotenv").config();
const jwt = require("jsonwebtoken");
const { verify } = require("../util/jwt_util");
const { ERR } = require("../config/config");
dot.config();

const authMiddleware = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      const reqToken = req.headers.quthorization.split("Bearer ")[1];
      const tokenVerify = verify(reqToken);
      const { ok, uid } = tokenVerify;
      if (!ok) throw Error(ERR.REQ_AUTH_NOTFOUND);
      req.id = uid;
      next();
    } else throw Error(ERR.REQ_AUTH_NOTFOUND);
  } catch (error) {
    res.status(401).send({
      ok: false,
      msg: error.message,
    });
  }
};

module.exports = { authMiddleware };
