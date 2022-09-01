exports.getLogin = (req, res, next) => {
  // loggedIn = true 이렇게 쿠키에 담아서 보냈기때문에 true만 추출하려고 이렇게 씀
  const isLoggedIn = req.get("Cookie").split(";")[1].trim().split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  // 일단 true로 설정해서 로그인 시킴
  // Expires = '쿠키 만료일' , Secure - 쿠키가 HTTPS를 통해 페이지가 제공될때만 설정됨
  // req.setHeader("Set-Cookie", "loggedIn = true ; Max-Age=10");
  req.isLoggedIn = true;
  res.redirect("../view/main");
};
 