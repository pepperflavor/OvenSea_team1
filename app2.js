const SocketServer = require("./socket/server");
const Sequelize = require("sequelize"); ;
const express = require("express");
const ejs = require("ejs");
const path = require("path");
const config = require("./config/config");


const session = require("express-session");
const { encrypt, compare } = require("./crypto");
const cookie = require("cookie-parser");
const {upload} = require("./routers/upload");
const { sign, verify } = require("./util/jwt_util");
const { promisify } = require("util");
const { ERROR_CODE } = require("./config/config");
const { stringify } = require("querystring");



const adminRouters = require("./routers/admin");
const editorRouter = require("./routers/editor");

// const connect = require("connect");



// 로그인 관련 router
const authRouters = require("./routers/auth");



// 이렇게 폴더 경로까지만 잡으면 index 탐색 찾은 index파일을 가져옴.
const {
  sequelize,
  User,
  Post,
  Nft,
  Rank,
  FreeChat,
  ChatMember,
  ActionChat,
  ChatLog,
  Editor,
} = require("./models");

const fs = require("fs");
const { createUid, createNftId } = require("./util/createRandom");
const db = require("./models");

const app = express();
app.use(express.urlencoded({extended : false}));
const PORT = 3000;
const SOCKET_PORT = 3030;

//========== 제호 오빠가 해놓은 세션
// app.use(
//   session({
//     store : ,
//     // 세션 발급할때 사용되는 키 노출되면 안되니까 .env파일에 값을 저장해놓고 사용 process.env.SESSION_KEY
//     secret: process.env.SESSION_KEY,
//     // 세션을 저장하고 불러올 때 세션을 다시 저장할지 여부
//     resave: false,
//     // 세션에 저장할 때 초기화 여부를 설정
//     saveUninitialized: true,
//   })
// );
///=================================



// ================== 세션 설정 시작
// config에 쓴 db "database", "username", "password" 전달해주면됨
var _sequelize = new Sequelize(config.database, config.username, config.password, {
  dialect: "sqlite",
  storage: "./session.sqlite",
});

// 익스프레스를 사용할시 
// const SequelizeStore = require("connect-session-sequelize")(
//   connect.session.Store
// );
// 말고 아래처럼 선언해주면 된다
const SequelizeStore = require('connect-session-sequelize')(session.Store);

// connect().use(
//   connect.session({
//     store: new SequelizeStore(db),
//     secret: "CHANGEME",
//   })
// );

//======= 세션 db 관련

// express-session에서 임포트하는 세션 객체는 함수로 산출되며 산출물은 db에 저장된다
// const SequelizeStore = require("connect-session-sequelize")(
//   connect.session.Store
// );


// app.use(
//   session({
//     secret: "my secret",
//     store: new SequelizeStore({
//       db: _sequelize,
//     }),
//     resave: false, // we support the touch method so per the express-session docs this should be set to false
//     proxy: true, // if you do SSL outside of node.
//   })
// );

const sessionStore = new SequelizeStore({
  // ...??? 이게 왜 빨간줄인지...
  db: db.sequelize,
  checkExpirationInterval: 15 * 60 * 1000,
  // The interval at which to cleanup expired sessions in milliseconds.
  expiration: 24 * 60 * 60 * 1000,
  // The maximum age (in milliseconds) of a valid session.
});

app.use(
  session({
    store : sessionStore,
    // 세션 발급할때 사용되는 키 노출되면 안되니까 .env파일에 값을 저장해놓고 사용 process.env.SESSION_KEY
    secret: process.env.SESSION_KEY,
    // 세션을 저장하고 불러올 때 세션을 다시 저장할지 여부
    resave: false,
    // 세션에 저장할 때 초기화 여부를 설정
    saveUninitialized: true,
    proxy: true,
  })
);



// new SequelizeStore({
//   checkExpirationInterval: 15 * 60 * 1000,
//   // 만료된 세션을 정리하는 간격(밀리초). 만료 : 24 * 60 * 60 * 1000 // 유효한 세션의 최대 수명(밀리초)
// });
       

//============= 세션 설정 끝 ========================


//// join함수는 매개변수를 받아 주소처럼 합쳐줌
//// path.join('a','b') => "a/b"
//// views 폴더까지의 경로가 기본값 렌더링할 파일을 모아둔 폴더
//// app.set express에 값을 저장가능 밑에 구문은 view키에 주소값을 넣은 부분
const server = app.listen(PORT, () => {
  console.log(PORT, "포트 연결");
});

//socket.io 생성 및 실행
// const socketServer = new SocketServer(server);

app.get("/admin/edit-nft-page", (req, res) => {
  res.render("admin/edit-nft", { isAuthenticated: true, editing : true });
  // const access_token = req.cookies.access_token;
  // const uid = jwt.decode
  // const {grade} = User.findOne({where: {uid: uid}})
  // if (grade === ADMIN_GRADE)
  //   res.render("admin/edit-nft", { isAuthenticated: true });
  //   else 
  //   res.redirect("login");
});

// nft 등록 데이터 받기
app.post("/admin/edit-nft", upload.single("image"), (req, res) => {
  console.log(req);
  const nftTitle = req.body.title;
  const nftPrice = req.body.price;
  const nftContent = req.body.nft_content;
  const nftOwner = req.body.nft_owner;
  res.end();
  console.log();
});


//=====editor 신청받기 session으로 사요ㅕㅇ자 정보 받아오기
app.get("/editor/editor-apply", (req, res) => {
  res.render("/editor/editor-apply", {
  });
});









// app.get("/chatmember", (req, res) => {
//   res.render("data", "");
// });

// app.get("/chat/add-chatmember", (req, res) => {
//   const { roomType } = req.body;
//   console.log(roomType);
// });

// app.get("/getChatmember", async (req, res) => {
//   const datas = await getAllData(Nft);
//   res.send(datas);
// });

// io.sockets(server).on("connection", (socket) => {
// });

// // sequelize 구성 연결 및 테이블 생성 여기가 처음 매핑
// // sync 함수는 데이터베이스 동기화하고 필요한 테이블을 생성해준다.
// // 필요한 테이블들이 생기고 매핑된다.
// // 테이블 내용이 다르면 먼저 오류를 뱉어냄s
// // CREATE TABLE 구문이 여기서 실행됨.
// // force 강제실행 초기화 시킬것인지(테이블 초기화 할것인지)

app.set("views", path.join(__dirname, "view"));

app.engine("html", ejs.renderFile);

app.set("view engine", "html");

// 이경로로 들어오는 요청은 해당 라우터만 사용함
app.use("/static", express.static(__dirname));

app.use("/admin", adminRouters);
app.use(authRouters);
// app.use(multer);


//========== 파일 업로드 설정 시작

app.use(express.static(path.join(__dirname, "/public"))); // 정적 파일 설정 (미들웨어) 3
app.use("/uploadimg", express.static(__dirname + "/uploadImg"));
//========= 파일 업로드 설정 끝


//body 객체 사용
app.use(express.urlencoded({ extended: false }));

sequelize
  .sync({ force: true })
  .then(() => {
    console.log("DB연결 성공");
    // initDbMultiple();
  })
  .catch((err) => {
    console.log(err);
  });


  
  app.post("/admin/edit-nft-page",upload.single('file'),(req, res) => {
    // const { nft_title, nft_img, nft_owner, nft_content } = req.body;
    // res.send({ nft_title, nft_img, nft_owner, nft_content });
    console.log(req);
    const nftUid = createNftId();
    const title = req.body.title;
    const price = req.body.price;
    const content = req.body.nft_content;
    const owner = req.body.nft_owner;
    const imgUrl = req.body.NFTimg;

    Nft.update(
      {
        nftUid: nftUid,
        imgUrl: imgUrl,
        title: title,
        price: price,
        content: content,
        owner: owner,
        profilePicture:
          "uploadimg/" + req.file.originalname.replace(".PNG", ""),
      },
      {
        where: {
          nftUid: nftUid,
        },
      }
    );
    res.redirect("/index.html");
  });

app.get("/", (req, res) => {
  // const userData = await getAllData(User, {});
  // console.log(userData);
  // res.render("index");
  res.render("index");
  // fs.readFile("view/index", (err, data) => {
  // });
});

app.get("/getDatas", async (req, res) => {
  const datas = await getAllData(User);
  res.send(datas);
  if (req.body.secret === "뀨") {
    const datas = await getAllData();
    console.log(datas);
  }
});
app.get("/getDatas2", async (req, res) => {
  const datas = await getAllData(Rank);
  res.send(datas);
  if (req.body.secret === "뀨") {
    const datas = await getAllData();
    console.log(datas);
  }
});
app.get("/getDatas3", async (req, res) => {
  const datas = await getAllData(Nft);
  res.send(datas);
  if (req.body.secret === "뀨") {
    const datas = await getAllData();
    console.log(datas);
  }
});
app.get("/getDatas4", async (req, res) => {
  const datas = await getAllData(ChatMember);
  res.send(datas);
  if (req.body.secret === "뀨") {
    const datas = await getAllData();
    console.log(datas);
  }
});

async function getAllData(db, query) {
  return new Promise((resolve, reject) => {
    db.findAll({ ...query })
      .then((datas) => {
        resolve(datas.map((data) => data.dataValues));
      })
      .catch((err) => reject(err));
  });
}

//==== chat기능 관련 fk키 여러개 설정

// free chat에서 유저 접속시간 비교를 위해서 시간 뽑아오기
// app.get("/freechat", (req, res) => {
//   FreeChat.findOne({
//     where: {
//       created_at: req.params.created_at,
//     },
//     include: [
//       {
//         model: chat_member,
//       },
//     ],
//   }).then((e) => {
//     console.log(e.dataValues);
//   });
// });

//========= create 구문

function createOne() {
  User.create({
    uid: createUid(),
    pwd: "쀼쀼쀼쀼쀼",
    name: "name",
    email: "뀨뀨뀨뀨뀨뀨뀨@naver.com",
    balance: 987654321098765,
    grade: 0,
    gallery: JSON.stringify([
      createUid(),
      createUid(),
      createUid(),
      createUid(),
    ]),
  });

  // Nft.create({
  //   nft_id: createNftId(),
  //   title: "쀼쀼쀼쀼쀼",
  //   content: "뀨뀨뀨뀨뀨뀨뀨뀨",
  //   img_url: "/뀨쀼뀨쀼뀨.",
  //   history: JSON.stringify([
  //     { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
  //     { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
  //     { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
  //     { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
  //     { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
  //   ]),
  // });

  Rank.create({
    nft_id: createNftId(),
    score: 1231231231,
    nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
    img_url: "/뀨쀼뀨쀼뀨.",
    user_id: createUid(),
  });
}

function initDbMultiple() {
  User.bulkCreate([
    {
      uid: createUid(),
      pwd: "쀼쀼쀼쀼쀼",
      name: "유저_1 뀨뀨",
      email: "뀨뀨뀨뀨뀨뀨뀨@naver.com",
      balance: 987654321098765,
      grade: 0,
      gallery: JSON.stringify([
        createUid(),
        createUid(),
        createUid(),
        createUid(),
      ]),
    },
    {
      uid: createUid(),
      pwd: "쀼쀼쀼쀼쀼",
      name: "유저_2 쀼쀼",
      email: "뀨뀨뀨뀨뀨뀨뀨@naver.com",
      balance: 987654321098765,
      grade: 0,
      gallery: JSON.stringify([
        createUid(),
        createUid(),
        createUid(),
        createUid(),
      ]),
    },
    {
      uid: createUid(),
      pwd: "쀼쀼쀼쀼쀼",
      name: "name",
      email: "뀨뀨뀨뀨뀨뀨뀨@naver.com",
      balance: 987654321098765,
      grade: 0,
      gallery: JSON.stringify([
        createUid(),
        createUid(),
        createUid(),
        createUid(),
      ]),
    },
    {
      uid: createUid(),
      pwd: "쀼쀼쀼쀼쀼",
      name: "name",
      email: "뀨뀨뀨뀨뀨뀨뀨@naver.com",
      balance: 987654321098765,
      grade: 0,
      gallery: JSON.stringify([
        createUid(),
        createUid(),
        createUid(),
        createUid(),
      ]),
    },
  ]);

  Nft.bulkCreate([
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
    {
      nft_id: createNftId(),
      title: "쀼쀼쀼쀼쀼",
      content: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
  ]);

  Rank.bulkCreate([
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
    {
      nft_id: createNftId(),
      score: 1231231231,
      nickname: "뀨뀨뀨뀨뀨뀨뀨뀨",
      img_url: "/뀨쀼뀨쀼뀨.",
      user_id: createUid(),
    },
  ]);
}
