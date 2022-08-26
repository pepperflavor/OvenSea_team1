const SocketServer = require("./socket/server");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
// 이렇게 폴더 경로까지만 잡으면 index 탐색 찾은 index파일을 가져옴.
const { sequelize, User, Post, Nft, Rank } = require("./model");
const fs = require("fs");
const { createUid, createNftId } = require("./util/createRandom");

const app = express();

const PORT = 3000;
const SOCKET_PORT = 3030;

// // join함수는 매개변수를 받아 주소처럼 합쳐줌
// // path.join('a','b') => "a/b"
// // views 폴더까지의 경로가 기본값 렌더링할 파일을 모아둔 폴더
// // app.set express에 값을 저장가능 밑에 구문은 view키에 주소값을 넣은 부분
const server = app.listen(PORT, () => {
  console.log(PORT, "포트 연결");
});



//socket.io 생성 및 실행
const socketServer = new SocketServer(server)



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

app.use("/static", express.static(__dirname));

//body 객체 사용
app.use(express.urlencoded({ extended: false }));

sequelize
  .sync({ force:false })
  .then(() => {
    console.log("DB연결 성공");
    // initDbMultiple();
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", async (req, res) => {
  // const userData = await getAllData(User, {});
  // console.log(userData);
  // res.render("index");
  fs.readFile("view/index", (err, data) => {
    res.render("index");
  });
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

// User.findAll({}).then((datas) => {
//   datas.map((data) => {
//     console.log("@@@@", data.dataValues);
//   });
// });

async function getAllData(db, query) {
  return new Promise((resolve, reject) => {
    db.findAll({ ...query })
      .then((datas) => {
        resolve(datas.map((data) => data.dataValues));
      })
      .catch((err) => reject(err));
  });
}

// app.post("/create", (req, res) => {
//   // create이 함수를 사용하면 해당 테이블에 컬럼을 추가할 수 이다.
//   const { name, age, msg } = req.body;
//   const create = User.create({
//     name,
//     age,
//     msg,
//   });
// });

// app.get("/user", (req, res) => {
//   // 여기서는 추가된 유저를 확인해야한다.
//   // user 전체를 조회하거나  조건으로  user 를 가져와야한다.
//   User.findAll({})
//     .then((data) => {
//       // Post.findAll({ where: { name: data.id } });

//       res.render("page", { data });
//     })
//     .catch((err) => {
//       //실패하면 에러 페이지를 보여준다.
//       res.render("err");
//     });
// });

// app.post("/create_post", (req, res) => {
//   const { name, text } = req.body;
//   console.log(name, text);
//   User.findOne({ where: { name: name } }).then((e) => {
//     Post.create({
//       msg: text,
//       // foreignkey user_id 이고 유저
//       user_id: e.id,
//       name,
//     });
//   });
// });

// app.get("/view/:name", (req, res) => {
//   User.findOne({
//     where: {
//       name: req.params.name,
//     },
//     // 리턴값을 단일 객체로 변형해서
//     // raw: true,
//     // 관계형 모델 불러오기
//     // 관계를 맺어 놓은 모델을 조회할 수 있다.
//     // 여기서는 해당 검색된 유저와 맞는 모델
//     // user 모델 id가 1번이면 post 모델의 user_id 키가 같은 애들을 조회
//     include: [
//       {
//         model: Post,
//       },
//     ],
//   }).then((e) => {
//     // console.log(e);
//     e.dataValues.Post = e.dataValues.Posts.map((i) => i.dataValues);
//     const Posts = e.dataValues;
//     console.log(Posts);
//     res.render("view", { data: Posts });
//   });
// });

// app.get("/del/:id", (req, res) => {
//   //삭제 쿼리문
//   Post.destroy({
//     where: { id: req.params.id },
//   }).then(() => {
//     res.redirect("/user");
//   });
// });
// app.post("/view_update", (req, res) => {
//   const { id, msg, text } = req.body;
//   /**
//    * 수정 쿼리문 사용
//    * 객체가 들어가는데
//    * 첫번째 매개변수 : 수정할 내용
//    * 두번째 매개변수 : 검색조건
//    */
//   Post.update({ msg }, { where: { id, msg: text } });
// });

//socket.io 생성 및 실행
// const io = socketio(server);

// io.sockets.on("connection", (socket) => {

// });

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

  Nft.create({
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
  });

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