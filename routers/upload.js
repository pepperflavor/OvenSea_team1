const multer = require("multer");
const fs = require("fs");
const path = require("path");

try {
  fs.readdirSync("uploads"); // 폴더 확인
} catch (err) {
  console.error("uploads 폴더가 없습니다. 폴더를 생성합니다.");
  fs.mkdirSync("uploads"); // 폴더 생성
}

// 이미지 받았을 때 필터링
const imageFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    const tag = file.originalname.split('.')[1];
    console.log(tag);
    return cb(new Error("Only image files are allowed!"));
  }
  cb(null, true);
};

const upload = multer({
  fileFilter: imageFilter,
  storage: multer.diskStorage({
    // 저장한공간 정보 : 하드디스크에 저장
    destination(req, file, done) {
      // 저장 위치
      done(null, "./uploads"); // uploads라는 폴더 안에 저장
    },
    filename(req, file, done) {
      // 파일명을 어떤 이름으로 올릴지
      const ext = path.extname(file.originalname); // 파일의 확장자
      done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일이름 + 날짜 + 확장자 이름으로 저장
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5메가로 용량 제한
});

module.exports = { upload };
