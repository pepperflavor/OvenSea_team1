const ServerSocket = require("./socket/server");
const Socketio = require("socket.io");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
// const {authMW} = require("./middleware/authMiddleware");
// 이렇게 폴더 경로까지만 잡으면 index 탐색 찾은 index파일을 가져옴.
const { sequelize, User, Post, Nft, Rank } = require("./model");
const fs = require("fs");
const { createUid, createNftId } = require("./util/createRandom");
const constance = require("./model/constants");
const session = require("express-session");
const { encrypt, compare } = require("./crypto");
const cookie = require("cookie-parser");
const { sign, verify } = require("./util/jwt_util");
const { ERROR_CODE } = require("./config/config");
const { stringify } = require("querystring");

const app = express();

const PORT = 3000;

// // join함수는 매개변수를 받아 주소처럼 합쳐줌
// // path.join('a','b') => "a/b"
// // views 폴더까지의 경로가 기본값 렌더링할 파일을 모아둔 폴더
// // app.set express에 값을 저장가능 밑에 구문은 view키에 주소값의 부분
const server = app.listen(PORT, () => {
  console.log(PORT, "포트 연결");
});

const io = Socketio(server);

const auction = new ServerSocket(io, "auction");
const chat = new ServerSocket(io, "chat");
const event = new ServerSocket(io, "event");

// const event = new ServerSocket(io, "event");

auction.setConnection(() => {
  auction
    .on({
      event: "bid",
      callback: (data) => {
        // console.log(data);
        // console.log("auction_send : 뀨");
      },
    })
    .on({
      event: "check",
      callback: (data) => {
        // console.log(data);
        // console.log("auction_send : 뀨");
      },
    })
    .on({
      event: "ask",
      callback: (data) => {
        // console.log(data);
        // console.log("auction_send : 뀨");
      },
    })
    .on({
      event: "",
      callback: (data) => {
        // console.log(data);
        // console.log("auction_send : 뀨");
      },
    })
    .on({
      event: "뀨",
      callback: (data) => {
        // console.log(data)
        // console.log("auction_send : 뀨")
      },
    })
    .on({
      event: "tiemOut",
      callback: (data) => {
        // console.log(data)
        // console.log("auction_send : 뀨")
      },
    })
    .on({
      event: "sell",
      callback: (data) => {
        // console.log(data)
        // console.log("auction_send : 뀨")
      },
    })
    .on({
      event: "buy",
      callback: (data) => {
        // console.log(data)
        // console.log("auction_send : 뀨")
      },
    });
});

chat.setConnection(() => {
  chat
    .on({
      event: "join",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "leave",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "뀨",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "뀨",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "뀨",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    });
});

event.setConnection(() => {
  event
    .on({
      event: "join",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "join",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "join",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "join",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "join",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    })
    .on({
      event: "join",
      callback: (data) => {
        // console.log(data);
        // console.log("chat_send : 뀨");
      },
    });
});

const authMW = (req, res, next) => {
  const accessVerify = verify(req.cookies?.accessToken);

  if (!accessVerify.ok) {
    const refreshVerify = verify(req.cookies?.refreshToken, "refresh");

    if (!refreshVerify.ok) res.render("login");

    const newAccessToken = sign(refreshVerify.uid);
    console.log("엑세스토큰 새로발급");
    req.session.accessToken = newAccessToken;
    next();
  }
  next();
};

app.set("views", path.join(__dirname, "view"));

app.engine("html", ejs.renderFile);

app.set("view engine", "html");

app.use(cookie());

app.use("/static", express.static(__dirname));

//body 객체 사용
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    // 세션 발급할때 사용되는 키 노출되면 안되니까 .env파일에 값을 저장해놓고 사용 process.env.SESSION_KEY
    secret: process.env.SESSION_KEY,
    // 세션을 저장하고 불러올 때 세션을 다시 저장할지 여부
    resave: false,
    // 세션에 저장할 때 초기화 여부를 설정
    saveUninitialized: false,
  })
);

sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("DB연결 성공");
    // createAdmin()
    // initDbMultiple();
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/", (req, res) => {
  fs.readFile("view/index", (err, data) => {
    res.render("index");
  });
});

// app.get("/getDatas", async (req, res) => {
//   const datas = await getAllData(User);
//   res.send(datas);
//   if (req.body.secret === "뀨") {
//     const datas = await getAllData();
//     console.log(datas);
//   }
// });

// app.get("/getDatas2", async (req, res) => {
//   const datas = await getAllData(Rank);
//   res.send(datas);
//   if (req.body.secret === "뀨") {
//     const datas = await getAllData();
//     console.log(datas);
//   }
// });
// app.get("/getDatas3", async (req, res) => {
//   const datas = await getAllData(Nft);
//   res.send(datas);
//   if (req.body.secret === "뀨") {
//     const datas = await getAllData();
//     console.log(datas);
//   }
// });

app.post("/login", async (req, res) => {
  try {
    const { user_email, user_pwd } = req.body;
    const user = await User.findOne({ where: { email: user_email } });
    const queryResult = user?.dataValues;
    const compareOk = await compare(user_pwd, queryResult?.pwd);

    if (!compareOk) throw Error("아이디나 비밀번호가 잘못됨");

    const accessToken = sign(user);
    const refreshToken = sign(user, "refresh");

    res.cookie("uid", user?.uid, { maxAge: constance.ONE_DAY });
    res.cookie("accessToken", accessToken, { maxAge: constance.ONE_DAY });
    res.cookie("refreshToken", refreshToken, { maxAge: constance.ONE_WEEK });

    res.redirect("main");
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/loginpage", (req, res) => {
  res.render("login");
});

app.post("/logout"),
  (req, res) => {
    res.render("index");
  };

app.post("/main", authMW, async (req, res) => {
  const { user_email, user_pwd } = req.body;
  console.log("@@@@@main_post", user_email, user_pwd);
  const user = await User.findOne({ where: { email: user_email } });
  const { pwd } = user?.dataValues;
  const ok = await compare(user_pwd, pwd);
  if (ok) {
    res.render("main");
  } else {
    res.redirect("/");
  }
});

app.post("/existEmail", async (req, res) => {
  const { user_email } = req.body;
  const exist = await User.findOne({ where: { email: user_email } });
  if (exist)
    res.send(JSON.stringify({ ok: false, msg: "아이디가 존재합니다." }));
  else res.send(JSON.stringify({ ok: true, msg: "아쥬 죠아" }));
});

app.post("/signup", async (req, res) => {
  try {
    const { user_email, user_pwd } = req.body;

    const uid = createUid();
    const user = {
      uid: uid,
      name: user_email,
      balance: 50000,
      grade: constance.NORMAL_GRADE,
      email: user_email,
      gallery: stringify([]),
      img_url:
        "https://firebasestorage.googleapis.com/v0/b/kyoungil-f459e.appspot.com/o/1%20(1).gif?alt=media&token=857b466c-fa52-4b49-b998-bb5068f8d57a",
    };
    const hashedPwd = await encrypt(user_pwd);
    user["pwd"] = hashedPwd;

    const accessToken = sign(user, (expiresIn = "1d"));
    // refresh token 발급
    const refreshToken = sign(
      user,
      (token_type = "refresh"),
      (expiresIn = "1w")
    );
    user["refresh_token"] = refreshToken;

    res.cookie("accessToken", accessToken, { maxAge: constance.ONE_DAY });
    res.cookie("refreshToken", refreshToken, { maxAge: constance.ONE_WEEK });

    await User.create(user);

    res.redirect("/");
  } catch (error) {
    console.log("@@@signup", error);

    res.redirect("/");
  }
});

app.get("/logOut", (req, res) => {
  // res.cookie("accessToken",res.session.accessToken);
  res.redirect("/");
});

app.get("/main", authMW, (req, res) => {
  const ref = verify(req.cookies?.accessToken);
  console.log("@@@main", ref);
  // res.cookie("accessToken",res.session.accessToken);
  res.render("main");
});

app.get("/editNft", (req, res) => {
  console.log("@@@editNft", ref);
  res.render("editNft");
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

function createAdmin() {
  const Nfts = [createUid(), createUid(), createUid(), createUid()];
  User.create({
    uid: "admin",
    pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
    name: "admin",
    email: "test@naver.com",
    balance: 987654321098765,
    grade: 0,
    refresh_token: sign("admin"),
    gallery: JSON.stringify([...Nfts]),
  }).then(() => {
    Nft.bulkCreate([
      {
        nft_id: Nfts[0],
        title: "NFT제목1",
        content: "NFT내용1",
        img_url:
          "https://trboard.game.onstove.com/Data/TR/20170718/20/636360060838331309.jpg",
        history: JSON.stringify([
          { prev_owner: createUid(), curr_owner: "admin", price: 999999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
        ]),
        onwer: "admin",
      },
      {
        nft_id: Nfts[1],
        title: "NFT제목2",
        content: "NFT내용2",
        img_url:
          "https://s3.orbi.kr/data/file/united/995556963_B6vl079m_8F223DF0-FEDE-434A-9439-8DF090FC8A66-5388-000005FED6FDB041_file.gif",
        history: JSON.stringify([
          { prev_owner: createUid(), curr_owner: "admin", price: 999999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
        ]),
        onwer: "admin",
      },
      {
        nft_id: Nfts[2],
        title: "NFT제목3",
        content: "NFT내용3",
        img_url: "https://cdn.cashfeed.co.kr/attachments/d070572048.jpg",
        history: JSON.stringify([
          { prev_owner: createUid(), curr_owner: "admin", price: 999999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
        ]),
        onwer: "admin",
      },
      {
        nft_id: Nfts[3],
        title: "NFT제목4",
        content: "NFT내용4",
        img_url:
          "https://s3.orbi.kr/data/file/united/3076648493_6OwZD2W7_3716959146_nGmh9FkA_E46C698A-F9F6-4A54-8F9D-A2F13A450DA6-490-000000468E3E8B5D_tmp.png",
        history: JSON.stringify([
          { prev_owner: createUid(), curr_owner: "admin", price: 999999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
          { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
        ]),
        onwer: "admin",
      },
    ]);
  });
}

function initDbMultiple() {
  User.bulkCreate([
    {
      uid: "123",
      pwd: "123",
      name: "유저_1 뀨뀨",
      email: "뀨뀨뀨뀨뀨뀨뀨@naver.com",
      balance: 987654321098765,
      grade: 0,
      refresh_token: "1",
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
      refresh_token: "1",
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
      refresh_token: "1",
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
      refresh_token: "1",
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

const setImage = () => {
  return [
    {
      id: 0,
      title: "이미지1",
      content: "설명1",
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
      id: 0,
      title: "이미지2",
      content: "설명2",
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
      id: 0,
      title: "이미지3",
      content: "설명3",
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
      id: 0,
      title: "이미지4",
      content: "설명4",
      img_url: "/뀨쀼뀨쀼뀨.",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
    },
  ];
};
