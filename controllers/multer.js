// module.exports = (app) => {
//   const db = require("../models/index");
//   const Image = db.images;
//   const upload = require("../routers/multer");
//   const fs = require("fs");
//   const multer = require("multer");

//   var router = require("express").Router();

//   //======= 파일 업로드 설정
//   // 파일을 저장할 디렉토리 설정 (현재 위치에 uploads라는 폴더가 생성되고 하위에 파일이 생성된다.)
//   const upload = multer({
//     dest: __dirname + "/uploads/",
//   });

//   router.post("/upload", upload, async (req, res, next) => {
//     try {
//       // blob형태를 base64로 변환
//       const imgData = fs
//         .readFileSync(`app${req.file.path.split("app")[1]}`)
//         .toString("base64");

//       // db에 path 저장
//       // 서버 path를 적어줘야하는 건가...? 어떻게 적어야하는지 모르겠다ㅠ
//       await Image.create({ path: imgData });

//       res.json({ path: imgData });
//     } catch (err) {
//       res.status(400).json({ success: false, message: err.message });
//     }
//   });

//   app.use("/api/", router);
// };
