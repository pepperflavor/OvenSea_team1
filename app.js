const ServerSocket = require("./socket/server");
const Socketio = require("socket.io");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
// const {authMW} = require("./middleware/authMiddleware");
// 이렇게 폴더 경로까지만 잡으면 index 탐색 찾은 index파일을 가져옴.
const { sequelize, User, Post, Nft, Room, Chat, NftBrand } = require("./model");
const fs = require("fs");
const { createUid, createNftId } = require("./util/createRandom");
const constant = require("./model/constants");
const session = require("express-session");
const { encrypt, compare } = require("./crypto");
const cookie = require("cookie-parser");
const { sign, verify } = require("./util/jwt_util");
const { ERROR_CODE } = require("./config/config");

const app = express();

const PORT = 3000;

// // join함수는 매개변수를 받아 주소처럼 합쳐줌
// // path.join('a','b') => "a/b"
// // views 폴더까지의 경로가 기본값 렌더링할 파일을 모아둔 폴더
// // app.set express에 값을 저장가능 밑에 구문은 view키에 주소값의 부분
const server = app.listen(PORT, () => {
  console.log(PORT, "포트 연결");
});

sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("DB연결 성공");
    // initDb();
  })
  .catch((err) => {
    console.log(err);
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
      event: "leaveChatRoom",
      callback: (data) => {
        console.log("leaveChatRoom :", data);
      },
    })
    .on({
      event: "joinChatRoom",
      callback: (data) => {
        //my
        const { room_id, my_name, my_uid } = data;
        //console.log("joinCHatRoom", data);
        Chat.findAll({ where: { room_id } }).then((datas) => {
          const msgs_id = datas.map(({ dataValues }) => {
            const { not_read, id } = dataValues;
            //console.log("{ not_read, id } = ", dataValues);
            const arr_not_read = JSON.parse(not_read);

            if (arr_not_read.indexOf(my_name) > 0)
              arr_not_read.splice(arr_not_read.indexOf(my_name), 1);

            const string = JSON.stringify(arr_not_read);

            // const {sender,...new_not_read} = arr_not_read
            Chat.update({ not_read: string }, { where: { id } });
          });
        });
        console.log("joinChatRoom :", data);
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
    });
});

const authMW = (req, res, next) => {
  const accessVerify = verify(req.cookies?.accessToken);

  if (!accessVerify.ok) {
    const refreshVerify = verify(req.cookies?.refreshToken, "refresh");

    if (!refreshVerify.ok) res.render("login");

    const newAccessToken = sign(refreshVerify);
    res.cookie("accessToken", newAccessToken, { maxAge: constant.ONE_DAY });
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
    saveUninitialized: true,
  })
);

app.get("/", async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;

  const { ok, user } = verify(refreshToken, "refresh");

  if (ok) {
    res.render("index", { user, isLogin: true });
  } else {
    res.render("index", {user:"", img_url:"", isLogin: false });
  }
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

app.get("/chat", async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;

  const { ok, user } = verify(refreshToken, "refresh");
  console.log(ok);
  if (ok) {
    res.render("chat", { user, isLogin: true });
  } else {
    res.render("chat", { user, isLogin: false });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { user_email, user_pwd } = req.body;

    const user = await User.findOne({ where: { email: user_email } });

    //console.log("@@@@@@@@@@로그인", user.dataValues, user_email, user_pwd);

    const compareOk = await compare(user_pwd, user.dataValues?.pwd);

    if (!compareOk) throw Error("아이디나 비밀번호가 잘못됨");

    //console.log("로그인", user.dataValues);
    const accessToken = sign(user.dataValues);
    const refreshToken = sign(user.dataValues, "refresh");

    res.cookie("accessToken", accessToken, { maxAge: constant.ONE_DAY });
    res.cookie("refreshToken", refreshToken, { maxAge: constant.ONE_WEEK });

    //req.session.uid = user?.dataValues.uid;
    //req.session.accessToken = accessToken;
    //req.session.refreshToken = refreshToken;

    console.log("로그인성공", user.dataValues.uid);
    res.redirect("/");
  } catch (error) {
    console.log("로그인실패", error);
    // res.redirect("/login");
  }
});

app.post("/sendChat", authMW, async (req, res) => {
  const { room_id, msg, img_content } = req.body;

  const { accessToken, refreshToken } = req.cookies;

  const { user } = verify(refreshToken, "refresh");

  Room.findOne({ where: { room_id } }).then((room) => {
    const {
      dataValues: { member },
    } = room;
    const not_read = [];
    JSON.parse(member).forEach(({ name }) => {
      if (name !== user.name) {
        not_read.push(name);
      }
    });
    const toStringNotRead = JSON.stringify(not_read);

    const createChat = {
      room_id,
      msg,
      img_content,
      name: user.name,
      sender: user.uid,
      img_url: user.img_url,
      not_read: toStringNotRead,
    };
    // console.log("생성된createChat ", createChat);
    Chat.create(createChat).then((result) => {
      // console.log("newChat :", { event: "newChat", data: createChat });
      chat.toEmit({ to: "all", event: "newChat", ...createChat });
      chat.emit({ event: "newChat", ...createChat });
    });
  });
});
app.get("/loginpage", (req, res) => {
  res.render("login");
});

app.post("/getAuth", authMW, (req, res) => {
  const { refreshToken } = req.cookies;
  const { user } = verify(refreshToken, "refresh");
  res.send(user);
});

app.post("/logout"),
  (req, res) => {
    res.render("index");
  };

app.post("/main", authMW, async (req, res) => {
  const { user_email, user_pwd } = req.body;
  const user = await User.findOne({ where: { email: user_email } });
  const { pwd, img_url } = user?.dataValues;
  const ok = await compare(user_pwd, pwd);
  if (ok) {
    res.render("main", { user: user?.dataValues });
  } else {
    res.redirect("/");
  }
});

app.post("/getChats", async (req, res) => {
  const { room_id } = req.body;
  const chats = await Chat.findAll({
    where: { room_id },
    order: [
      ["updatedAt", "ASC"], //ASC DESC
    ],
  });
  // console.log(chats);
  res.send(chats);
});

app.post("/getRooms", async (req, res) => {
  // const { accessToken } = req.cookies?.accessToken;
  // console.log(accessToken);
  // const { uid } = verify(accessToken);
  // const searchUid = uid.uid;
  const { uid } = req.body;
  const {
    dataValues: { rooms },
  } = await User.findOne({ where: { uid } });

  const roomsObj = JSON.parse(rooms || "[]");

  const roomresult = await Room.findAll({
    where: { room_id: [...roomsObj] },
    order: [
      ["updatedAt", "ASC"], //ASC DESC
    ],
  });

  res.send(roomresult);
});

app.post("/existEmail", async (req, res) => {
  const { user_email } = req.body;
  const exist = await User.findOne({ where: { email: user_email } });
  if (exist)
    res.send(JSON.stringify({ ok: false, msg: "아이디가 존재합니다." }));
  else res.send(JSON.stringify({ ok: true, msg: "아쥬 죠아" }));
});

app.get("/signup", async (req, res) => {
  res.render("signup")
})

app.post("/signup", async (req, res) => {
  try {
    const { user_email, user_pwd, img_url, name } = req.body;

    // console.log({ user_email, user_pwd, img_url, name });
    const uid = createUid();
    const user = {
      uid: uid,
      name,
      balance: 50000,
      grade: constant.NORMAL_GRADE,
      email: user_email,
      gallery: JSON.stringify([]),
      img_url,
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

    // console.log(
    //   "refreshToken@@@@@@@@@@",
    //   verify(refreshToken, (token_type = "refresh"))
    // );
    // console.log("accessToken@@@@@@@@@@", verify(accessToken));

    res.cookie("accessToken", accessToken, { maxAge: constant.ONE_WEEK });
    res.cookie("refreshToken", refreshToken, { maxAge: constant.ONE_WEEK });

    await User.create(user);
    console.log("회원가입성공", user);

    res.redirect("/");
  } catch (error) {
    console.log("@@@signup", error);
    res.cookie("accessToken", "", { maxAge: 0 });
    res.cookie("refreshToken", "", { maxAge: 0 });
    res.redirect("/signup");
  }
});

app.get("/logOut", (req, res) => {
  // res.cookie("accessToken",res.session.accessToken);
  res.cookie("accessToken", "", { maxAge: 0 });
  res.cookie("refreshToken", "", { maxAge: 0 });
  res.redirect("/");
});

app.get("/main", authMW, (req, res) => {
  const ref = verify(req.cookies?.accessToken);
  // console.log("@@@main", ref);
  // res.cookie("accessToken",res.session.accessToken);
  res.render("main");
});

app.get("/editNft", (req, res) => {
  // console.log("@@@editNft", ref);
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

app.post("/getNftBrands", (req, res) => {
  NftBrand.findAll({}).then((datas) => {
    const nftBrands = datas.map(({ dataValues }) => {
      return dataValues;
    });
    res.send(nftBrands);
  });
});

app.post("/getNfts", (req, res) => {
  Nft.findAll({}).then((datas) => {
    const nfts = datas.map(({ dataValues }) => {
      return dataValues;
    });
    res.send(nfts);
  });
});

app.post("/getMyNfts", (req, res) => {});

app.post("/nftPage", (req, res) => {});

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

async function initDb() {
  const nfts = [createUid(), createUid(), createUid(), createUid()];
  const userNfts = [createUid(), createUid(), createUid(), createUid()];
  const rooms = [createUid(), createUid(), createUid(), createUid()];

  await User.bulkCreate([
    {
      uid: "admin",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "admin",
      email: "admin@naver.com",
      balance: 987654321098765,
      grade: constant.ADMIN_GRADE,
      img_url: "/static/image/cat.png",
      state: 0,
      rooms: JSON.stringify([...rooms]),
      refresh_token: sign("admin"),
      gallery: JSON.stringify([...nfts]),
    },
    {
      uid: "user1",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user1",
      email: "user1@naver.com",
      balance: 987654321098765,
      grade: constant.EDITOR_GRADE,
      img_url: "/static/image/turn.gif",
      state: 0,
      rooms: JSON.stringify([rooms[0], rooms[2]]),
      refresh_token: sign("user1"),
      gallery: JSON.stringify([...userNfts]),
    },
    {
      uid: "user2",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user2",
      email: "user2@naver.com",
      balance: 987654321098765,
      grade: constant.NORMAL_GRADE,
      img_url: "/static/image/brand.gif",
      state: 0,
      rooms: JSON.stringify([rooms[0], rooms[1]]),
      refresh_token: sign("user2"),
      gallery: JSON.stringify([]),
    },
    {
      uid: "user3",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user3",
      email: "user3@naver.com",
      balance: 987654321098765,
      grade: constant.NORMAL_GRADE,
      img_url: "/static/image/turn.gif",
      state: 0,
      rooms: JSON.stringify([rooms[0], rooms[2]]),
      refresh_token: sign("user3"),
      gallery: JSON.stringify([]),
    },
    {
      uid: "user4",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user4",
      email: "user3@naver.com",
      balance: 987654321098765,
      grade: constant.NORMAL_GRADE,
      img_url: "/static/image/brand.gif",
      state: 0,
      refresh_token: sign("user4"),
      gallery: JSON.stringify([]),
    },
    {
      uid: "user5",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user5",
      email: "user3@naver.com",
      balance: 987654321098765,
      grade: constant.NORMAL_GRADE,
      img_url: "/static/image/brand.gif",
      state: 0,
      refresh_token: sign("user5"),
      gallery: JSON.stringify([]),
    },
  ]);
  await NftBrand.bulkCreate([
    {
      brand_id: "PartyPenguinsContract",
      brand_name: "Party Penguins",
      img_url:
        "https://lh3.googleusercontent.com/gcMFBRjFtN-da5hbJqF6jywE31xbpc3oE6or4LjHQxoVpfP4N78aVe0XdleVI5l-Ech04EKom79kDLsAwHlbBwJqEIV57rxpXYgaVQo=h600",
      content:
        "Party Penguins is an NFT collection of 9,999 unique and flippin' cool penguins. They’ve moved from Antarctica to the Ethereum blockchain, because that’s where the real party is! Visit www.partypenguins.club to learn more.",
      editor_uid: "user1",
    },
    {
      brand_id: "펭귄조아",
      brand_name: "펭귄조아",
      img_url:
        "https://lh3.googleusercontent.com/13g3FRwKuCmawyeH_rN5VwYbQZ8KrWdN8IZf4_uKJ3IeLjligIY7ZZ_HR7b48RKUJuUfevFTMzxFJcBWdn51TyZVoAXNPqh1TCIprw=h600",
      content:
        "펭귄만 그림 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 펭귄조아 펭귄조아 펭귄조아 펭귄조아 펭귄조아 펭귄조아",
      editor_uid: "user2",
    },
    {
      brand_id: "피닐리아",
      brand_name: "피닐리아",
      img_url:
        "https://lh3.googleusercontent.com/2yxEzSzTzCzRwhi9HE5vZMI-2seqe0koChnBkuTBZ4q-N8O5whASxH0U2Y92ISrcc_wBqYR8usrFSoJ0QnRvKg8fM1UAyf4l3ArULQ=h600",
      content:
        "피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡",
      editor_uid: "user3",
    },
    {
      brand_id: "B5348D",
      brand_name: "Monkey Bet DAO",
      img_url:
        "https://lh3.googleusercontent.com/ao9PJufgNCy_uV6E2_LDRyp1SC2oHNTxFKh3XaoA5ugcy0Rwd5yiDr0lcNjyCPZSfJcS6cYeq8MGU5c344579eM4dcdF2Askc1Ps=h600",
      content:
        "Decentralized gaming x NFT protocol. Created by Invariant Labs.",
      editor_uid: "user4",
    },
  ]);
  await Nft.bulkCreate([
    {
      nft_id: createNftId(),
      title: "Party Penguin #1749",
      content: "펭귄1",
      img_url:
        "https://lh3.googleusercontent.com/wV9bwj-hpmjU50iKriaJ6Wo4etNITnG3zjC7sBNCIqRSt8vRMOYRijCZMVgtHcbs_OyT75zzcfORtqeT6GOF7K_aYtYKEYoeStMR=w345",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0065 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin1",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      title: "Party Penguin #3749",
      content: "펭귄2",
      img_url:
        "https://lh3.googleusercontent.com/HvzqKFsQnEe0Rm0v2uXqebAg-HCjpuSlmwb6RTQwtAO2jQXtMsWgQxiDp7iohGsDn7sxe20AztPxlsj8pXvHzxP0x6T27HK_6lIf=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.007 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin2",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      title: "Party Penguin #3742",
      content: "펭귄3",
      img_url:
        "https://lh3.googleusercontent.com/97jnzHZ-OWWU-cNB1Bl3HVXs2XnueV-Gp1_F0ga02PzE2aZpKk9IcWNo_LDvJ91huDWs9tAJv4WLlmdrOr9ERxtJ_NyuKHZKEAx6y9E=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.007 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin3",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      title: "Party Penguin #3738",
      content: "펭귄4",
      img_url:
        "https://lh3.googleusercontent.com/fyqIkdSLWKUHTVzxJ4bzv-aaL0Ghhde09l-tiYBBN2MSymiGOKW-PbfPDUVMcFqlDs-XWdnHQW-yq_SRjgAqfQ_hveZXYNp-aHxMEw=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.007 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin4",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      title: "Party Penguin #3755",
      content: "펭귄5",
      img_url:
        "https://lh3.googleusercontent.com/fLQmX7gGk_KZv3S-p7GOPWC1STJgSna3vDlgyo-psg1PUI2nVbvBcgAoL9no8VIeXOdjIE2jjpUknz0Sa0HVLSOOOcR09Y_yV-75b2s=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.007 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin5",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      title: "Party Penguin #123",
      content: "펭귄6",
      img_url:
        "https://lh3.googleusercontent.com/dIA2QjP9H4jyEsuywRKCRpLRILzLvqJnTISisUC0UlbiJmzBTWiBlXnKMS6cxmk-8asP8Cy_IenbW3tRUgvXUR32fCQpaXzeli-FvQ=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0071 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin6",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      title: "Party Penguin #1813",
      content: "펭귄7",
      img_url:
        "https://lh3.googleusercontent.com/2L3j3jds_43XO_Dic01ynoYDcuHeUzuQAPXdj6yMUrDao_lMNp7t3OsXOhH7O0ymy1_gbHRC1Xm6cj6nz3pQQxv6yd0KaTJy_75_=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0071 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin7",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      title: "Party Penguin #3739",
      content: "펭귄8",
      img_url:
        "https://lh3.googleusercontent.com/NwW0yCeUqy_l2jurERV-sBN7wVsAXU25Wltx7zljjqPcslaB2wFEFmsAEykMe_WLy7-HgzM0YiCYk5qDSlGgHxNetcIMJKdwKOsgkw=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0085 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin8",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      title: "Monkey #8315",
      content: "원숭이1",
      img_url:
        "https://lh3.googleusercontent.com/cqGBwQ1UgZpb0t8DqC18XUCvpLFdM3MhEu9PUoTyYjmO6rsFvts6vVWNUNQY_S9O0gU21lCasl1R1UiDtucYWc7k51VSfbGfkZLxpA=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0099 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin1",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      title: "Monkey #9101",
      content: "원숭이2",
      img_url:
        "https://lh3.googleusercontent.com/4GxEAKxjZ6CacIdJiBAy-qxmjv4E-VJA1AYYKZo-VktNk_dsY_1HqJThLpP4dLG_Tw135xmhMUtErpvq7mbL4RaQuu_2Uv7hibNXWA=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.011 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin2",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      title: "Monkey #5731",
      content: "원숭이3",
      img_url:
        "https://lh3.googleusercontent.com/1GIFAyQNFgv897ZDCKOR6ilFLURudiwerjCz3W9FVDgu15DQ47GpuvbJwQzmlNbsO934eESGWXjkdhtf-LIi8eI7AUR6I0IzPOoWeg=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.012 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin3",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      title: "Monkey #1197",
      content: "원숭이4",
      img_url:
        "https://lh3.googleusercontent.com/gshb_oaKmDhwLYaVdvEO-qxL0tJJ6b-jH1NF9agESDBNMrXh2pS03A9x8VF5NEkHtPD6uZNJ7Sh0qUH-aF4-fE8s59sdbRNayhWVHQ=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.015 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin4",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      title: "Monkey #4171",
      content: "원숭이5",
      img_url:
        "https://lh3.googleusercontent.com/YpQuTaHhkuamVYYJwZWbSl0G-AklublIP-oFTVGuUfWSdZ6WWO2bacZx4W0-Cf3YNZMv1ldtkCSQJA2oJSQH9VsW0qt6R27JF1SR=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.018 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin5",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      title: "Monkey #3043",
      content: "원숭이6",
      img_url:
        "https://lh3.googleusercontent.com/yAl7jMxGVd9JtUeNMUvL3XxTvOkCBDZ0hsZFQVHgw1VjYRXmFxhuZTG0W3s4HIwIGpY1WeUBw64QsqyEHSNnaIychG-uaGKPEHZx4DQ=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.02 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin6",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      title: "Monkey #3932",
      content: "원숭이7",
      img_url:
        "https://lh3.googleusercontent.com/s4O1Oc1ro8hZ42nNLLvdH3KFUvb50IVUu9a3fYa-TH3ZOPzgsBHyyc2NPd2zcoRWlbyI_Dd8kCbTdHBH1p2zEgDsqh9dVKHtM42rQw=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.02 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin7",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      title: "Monkey #4564",
      content: "원숭이8",
      img_url:
        "https://lh3.googleusercontent.com/O_PwQ05f6fuezqGSHXCvfJAhf56V1tLeDLpdJdx5bcaRxxfsfLP26YrmJ1PW-V9lxl7-GOcbYowMVHgz5XRiEao-RqaggCPXgqjs=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.025 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin8",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
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
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",
    },
    {
      nft_id: nfts[1],
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
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",
    },
    {
      nft_id: nfts[2],
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
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",
    },
    {
      nft_id: nfts[3],
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
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",

      nft_id: userNfts[0],
      title: "NFT제목1",
      content: "NFT내용1",
      img_url:
        "https://s3.orbi.kr/data/file/united/3076648493_6OwZD2W7_3716959146_nGmh9FkA_E46C698A-F9F6-4A54-8F9D-A2F13A450DA6-490-000000468E3E8B5D_tmp.png",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "user1", price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "user1",
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",
    },
    {
      nft_id: userNfts[1],
      title: "NFT제목2",
      content: "NFT내용2",
      img_url:
        "https://s3.orbi.kr/data/file/united/3076648493_6OwZD2W7_3716959146_nGmh9FkA_E46C698A-F9F6-4A54-8F9D-A2F13A450DA6-490-000000468E3E8B5D_tmp.png",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "user1", price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "user1",
      brand_name: "피닐리아",
      brand_id: "피닐리아",
    },
  ]);
  await Room.bulkCreate([
    {
      room_id: rooms[0],
      event: JSON.stringify([
        {
          uid: "user1",
          name: "user1",
          img_url: "/static/image/turn.gif",
          msg: "방1 테스트1",
        },
      ]), //[{uid, msg, not_read}]
      member: JSON.stringify([
        { uid: "admin", name: "admin", img_url: "/static/image/cat.png" },
        { uid: "user1", name: "user1", img_url: "/static/image/turn.gif" },
        { uid: "user2", name: "user2", img_url: "/static/image/brand.gif" },
        { uid: "user3", name: "user3", img_url: "/static/image/turn.gif" },
      ]),
    },
    {
      room_id: rooms[1],
      event: JSON.stringify([]),
      member: JSON.stringify([
        { uid: "admin", name: "admin", img_url: "/static/image/cat.png" },
        { uid: "user2", name: "user2", img_url: "/static/image/turn.gif" },
      ]),
    },
    {
      room_id: rooms[2],
      event: JSON.stringify([]),
      member: JSON.stringify([
        { uid: "admin", name: "admin", img_url: "/static/image/cat.png" },
        { uid: "user3", name: "user3", img_url: "/static/image/cry.gif" },
      ]),
    },
    {
      room_id: rooms[3],
      event: JSON.stringify([]),
      member: JSON.stringify([
        { uid: "admin", name: "admin", img_url: "/static/image/cat.png" },
        { uid: "user1", name: "user1", img_url: "/static/image/brand.gif" },
      ]),
    },
  ]);
  await Chat.bulkCreate([
    {
      room_id: rooms[0],
      sender: "admin",
      name: "admin",
      img_url: "/static/image/cat.png",
      msg: "방1 테스트1",
      not_read: JSON.stringify(["user1", "user2", "user3"]),
    },
    {
      room_id: rooms[0],
      sender: "user1",
      name: "user1",
      img_url: "/static/image/turn.gif",
      msg: "방1 테스트2",
      not_read: JSON.stringify(["user1", "user2", "user3"]),
    },
    {
      room_id: rooms[0],
      sender: "user2",
      name: "user2",
      img_url: "/static/image/brand.gif",
      msg: "방1 테스트3",
      not_read: JSON.stringify(["user1", "user2"]),
    },
    {
      room_id: rooms[0],
      sender: "user3",
      name: "user3",
      msg: "방1 테스트4",
      img_url: "/static/image/turn.gif",
      not_read: JSON.stringify(["user1"]),
    },
    {
      room_id: rooms[0],
      sender: "user3",
      name: "user3",
      msg: "방1 테스트4",
      img_url: "/static/image/turn.gif",
      not_read: JSON.stringify(["user1"]),
    },
    {
      room_id: rooms[1],
      sender: "admin",
      name: "admin",
      img_url: "/static/image/cat.png",
      msg: "방1 테스트2",
      not_read: JSON.stringify(["user2"]),
    },
    {
      room_id: rooms[1],
      sender: "user2",
      name: "user2",
      img_url: "/static/image/brand.gif",
      msg: "방1 테스트3",
      not_read: JSON.stringify(["admin"]),
    },
    {
      room_id: rooms[2],
      sender: "admin",
      name: "admin",
      img_url: "/static/image/cat.png",
      msg: "방1 테스트3",
      not_read: JSON.stringify(["user3"]),
    },
    {
      room_id: rooms[2],
      sender: "user1",
      name: "user1",
      img_url: "/static/image/turn.gif",
      msg: "방1 테스트4",
      not_read: JSON.stringify(["admin"]),
    },
  ]);
}
