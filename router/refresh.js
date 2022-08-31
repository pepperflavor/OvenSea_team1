//refresh.js

require("dotenv").config();

const { sign, verify, refreshVerify } = require("../util/jwt_util");
const { ERR } = require("../config/config");
const jwt = require("jsonwebtoken");

const refresh = async (req, res) => {
  try {
    const { authorization, refresh } = req.headers;
    if (authorization && refresh) {
      const authToken = authorization.split("Bearar ")[1];
      const refreshToken = refresh;

      const authResult = verify(authToken);
      if (!authResult.ok) throw Error(ERR.ACCESS_TOKEN_NOTVERIFY);

      const decoded = jwt.decode(authToken);
      if (decoded === null) throw Error(ERR.JWT_NOTDECODED);

      const refreshResult = refreshVerify(refreshToken, decoded.uid);

      const { ok, msg } = authResult;
      if (ok === false && msg === JWT_EXPIRED) {
        if (refreshResult.ok === false)
          throw Error(ERR.REFRESH_TOKEN_NOTVERIFY);
      } else {
      }
    }
  } catch (error) {}
};
