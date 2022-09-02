// require("dotenv").config();
// const { verify, refresh, refreshVerify, sign } = require("../util/jwt_util");

const authMW = (req, res, next) => {
  console.log("@@@@@@@@@미들웨어");
  const accessVerify = verify(req.cookies?.accessToken);

  if (!accessVerify.ok) {
    const refreshVerify = verify(req.cookies?.refreshToken, "refresh");

    if (!refreshVerify.ok) res.render("login");

    const newAccessToken = sign(refreshVerify.uid);
    console.log("엑세스토큰 새로발급");
    req.cookie("accessToken", newAccessToken);

    next();
  }
  next();
};
// // const authMW = (req, res, next) => {
// //   try {
// //     if (req.headers.authorization) {
// //       const reqToken = req.headers.authorization.split("Bearer ")[1];
// //       const tokenVerify = verify(reqToken);
// //       const { ok, uid } = tokenVerify;
// //       if (!ok) throw Error(ERR.REQ_AUTH_NOTFOUND);
// //       req.id = uid;
// //       next();
// //     } else throw Error(ERR.REQ_AUTH_NOTFOUND);
// //   } catch (error) {
// //     res.status(401).send({
// //       ok: false,
// //       msg: error.message,
// //     });
// //   }
// // };

// module.exports = { authMW };
