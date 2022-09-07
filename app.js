const ServerSocket = require("./socket/server");
const Socketio = require("socket.io");
const express = require("express");
const ejs = require("ejs");
const path = require("path");
// const {authMW} = require("./middleware/authMiddleware");
// 이렇게 폴더 경로까지만 잡으면 index 탐색 찾은 index파일을 가져옴.
const { User, Nft, Room, Chat, NftBrand } = require("./model");
const { createUid, createNftId } = require("./util/createRandom");
const constant = require("./model/constants");
const { encrypt, compare } = require("./util/crypto");
const cookie = require("cookie-parser");
const { sign, verify } = require("./util/jwt_util");
// const { ERROR_CODE } = require("./config/config");
const Json = require("./util/json_util");
const EventManager = require("./util/eventManager")
const {
  initDb,
  createData,
  findAllData,
  findData,
  updateData,
  deleteData,
} = require("./util/dbManager");
const app = express();

const PORT = 3000;

// // join함수는 매개변수를 받아 주소처럼 합쳐줌
// // path.join('a','b') => "a/b"
// // views 폴더까지의 경로가 기본값 렌더링할 파일을 모아둔 폴더
// // app.set express에 값을 저장가능 밑에 구문은 view키에 주소값의 부분
const server = app.listen(PORT, () => {
  console.log(PORT, "포트 연결");
});

initDb();
// initDb("init");

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
        console.log("joinChatRoom", data);
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

const onlineUser = [];
event.setConnection(() => {
  event.on({
    event: "online",
    callback: (newUser) => {
      console.log("online 이벤트", newUser);
      /**
       *  {uid     : "uid" ,
       *   name    : "userName"
       *   status  : "접속중",
       *   img_url : "sdf", }
       * */
      const isSameIdx = onlineUser.findIndex(
        (user) => user.uid === newUser.uid
      );

      if (isSameIdx === undefined) {
        onlineUser.push(newUser);
      }
      console.log(onlineUser);
      event.toEmit({ to: "all", event: "online", onlineUser });
    },
  });
});

const authMW = (req, res, next) => {
  const accessVerify = verify(req.cookies.accessToken);

  if (!accessVerify.ok) {
    const refreshVerify = verify(req.cookies.refreshToken, "refresh");

    if (!refreshVerify.ok) res.render("login");

    const newAccessToken = sign(refreshVerify);
    res.cookie("accessToken", newAccessToken, { maxAge: constant.ONE_DAY });
    // req.session.accessToken = newAccessToken;
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

// app.use(
//   session({
//     // 세션 발급할때 사용되는 키 노출되면 안되니까 .env파일에 값을 저장해놓고 사용 process.env.SESSION_KEY
//     secret: process.env.SESSION_KEY,
//     // 세션을 저장하고 불러올 때 세션을 다시 저장할지 여부
//     resave: false,
//     // 세션에 저장할 때 초기화 여부를 설정
//     saveUninitialized: true,
//   })
// );

app.post("/addRank", (req, res) => {
  const { score, nickname } = req.body;

  console.log(`addRank 닉네임 : ${nickname}, 스코어 ${score}`);

  res.send({ score, nickname });
});

app.get("/", async (req, res) => {
  const { accessToken, refreshToken, lightToken } = req.cookies;

  const { ok, user } = verify(refreshToken, "refresh");

  if (!lightToken)
    res.cookie("lightToken", createUid(), { maxAge: constant.ONE_DAY });

  if (ok) {
    res.render("index", { user, isLogin: true });
  } else {
    res.render("index", { user: "", img_url: "", isLogin: false });
  }
});

app.get("/chat", async (req, res) => {
  const { accessToken, refreshToken } = req.cookies;

  const { ok, user } = verify(refreshToken, "refresh");
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

    const compareOk = await compare(user_pwd, user.dataValues.pwd);

    if (!compareOk) throw Error("아이디나 비밀번호가 잘못됨");

    //console.log("로그인", user.dataValues);
    const accessToken = sign(user.dataValues);
    const refreshToken = sign(user.dataValues, "refresh");

    res.cookie("accessToken", accessToken, { maxAge: constant.ONE_DAY });
    res.cookie("refreshToken", refreshToken, { maxAge: constant.ONE_WEEK });

    //req.session.uid = user.dataValues.uid;
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
  try {
    const { room_id, msg, img_content } = req.body;

    const { refreshToken } = req.cookies;

    const { user } = verify(refreshToken, "refresh");

    Room.findOne({ where: { room_id } }).then((room) => {
      const {
        dataValues: { member },
      } = room;
      const not_read = [];

      const memberObj = new Json(member);
      const { isExist } = memberObj.find(({ name }) => {
        name === user.name;
      });
      const { uid, name, img_url } = user;

      console.log(isExist);

      if (!isExist) memberObj.push({ uid, name, img_url });

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
        res.send("end");
      });
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

app.post("/upLikeNft", async (req, res) => {
  try {
    let isSame;
    let like_length;
    let likeArr;
    const { id } = req.body;

    const { refreshToken } = req.cookies;

    const { ok, user } = verify(refreshToken, "refresh");

    if (ok) {
      const nft = await Nft.findOne({ where: { id } });

      const { like } = nft.dataValues;
      console.log(like);
      likeArr = Json(like);

      console.log("@@@@@@@@@@@@", likeArr);

      like_length = likeArr[0].name === "" ? 0 : likeArr.length;

      if (like_length !== 0) {
        likeArr = likeArr.map((value) => value);
        likeArr.push();
      } else {
        likeArr = [{ name: `${user.name}` }];
      }

      isSame = likeArr.find((name) => name === user.name);

      if (isSame === undefined) {
        like_length++;
        const update = await Nft.update(
          { like: JSON.stringify(likeArr) },
          { where: { id } }
        );
        console.log("@@@@@@@@@@@",update);
        res.send("1")
        // Nft.update({ like: JSON.stringify(likeArr) }, { where: { id } }).then(
        //   (id) => {
        //     res.status(200).send(1);
        //     // res.send(`end`);
        //     // console.log(id[0]);
        //     // Nft.findOne({ where: { id: id[0] } }).then((data) => {
        //     //   if (data.upLikeNft) {
        //     //     const { like } = dataValues;
        //     //     const result = JSON.parse(like).length;
        //     //     res.send("1")
        //     //   }
        //     // });
        //   }
        // );
      }
    } else {
      res.status(400).send("-1");
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("-1");
  }
});

app.get("/nftPage/:id", async (req, res) => {
  try {
    let isSame;
    let view_length;
    let like_length;
    let viewArr;
    let likeArr;
    const { id } = req.params;

    const { refreshToken, lightToken } = req.cookies;

    if (!lightToken)
      res.cookie("lightToken", createUid(), { maxAge: constant.ONE_DAY });

    const { ok, user } = verify(refreshToken, "refresh");

    // console.log(id);

    const nft = await Nft.findOne({ where: { id } });

    if (nft.dataValues) {
      const { view, like, id } = nft.dataValues;
      viewArr = JSON.parse(view);
      likeArr = JSON.parse(like);
      const isLike = likeArr.indexOf(user.name) > 0 ? true : false;

      //console.log(JSON.stringify(viewArr));
      //console.log(typeof viewArr, viewArr);
      //console.log("isSame :", isSame, viewArr);

      // console.log("viewArr[0]", viewArr, viewArr[0], viewArr[0].name);

      like_length = likeArr[0].name === "" ? 0 : likeArr.length;

      view_length = viewArr[0].name === "" ? 0 : viewArr.length;

      if (view_length !== 0) {
        viewArr = viewArr.map((value) => value);
      } else {
        viewArr = [{ name: `${lightToken}` }];
      }

      isSame = viewArr.find((name) => name === lightToken);

      if (isSame == undefined) {
        view_length++;
        Nft.update({ view: JSON.stringify(viewArr) }, { where: { id } });
      }

      const nftData = { view_length, like_length, isLike, ...nft.dataValues };
      // console.log({ user, ...nftData, isLogin: true });
      if (ok) {
        res.render("nftPage", { user, ...nftData, isLogin: true });
      } else {
        res.render("nftPage", { ...nftData, img_url: "", isLogin: false });
      }
    } else {
      if (ok) {
        res.render("index", { user, isLogin: true });
      } else {
        res.render("index", { img_url: "", isLogin: false });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/loginpage", (req, res) => {
  res.render("login");
});

app.post("/getAuth", (req, res) => {
  const { refreshToken, lightToken } = req.cookies;
  const { user } = verify(refreshToken, "refresh");
  res.send({ ...user });
});

app.post("/logout"),
  (req, res) => {
    res.render("index");
  };

app.post("/main", authMW, async (req, res) => {
  const { user_email, user_pwd } = req.body;
  const user = await User.findOne({ where: { email: user_email } });
  const { pwd, img_url } = user.dataValues;
  const ok = await compare(user_pwd, pwd);
  if (ok) {
    res.render("main", { user: user.dataValues });
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
  try {
    const { uid } = req.body;

    const user = await findData(User, { where: { uid } });

    const roomsObj = new Json(user.rooms);
    console.log(roomsObj.original);
    if (roomsObj.length === 0) throw new Error("not chat rooms");
    const roomList = [...roomsObj.original.map(({ room }) => room)];
    console.log("roomList", roomList);

    const roomResult = await findAllData(Room, {
      where: { room_id: roomList },
      order: [
        ["updatedAt", "ASC"], //ASC DESC
      ],
    });

    console.log("@@getRooms :", roomResult);
    res.send(roomResult);
  } catch (error) {
    res.send();
    console.log("err-getRooms :", error);
  }
});

app.post("/existEmail", async (req, res) => {
  const { user_email } = req.body;

  const user = await findData(User, { where: { email: user_email } });
  user === false
    ? res.send(JSON.stringify({ ok: true, msg: "아쥬 죠아 가입 진행시켜" }))
    : res.send(JSON.stringify({ ok: false, msg: "아이디가 존재합니다." }));
});

app.get("/signup", async (req, res) => {
  res.render("signup");
});

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

    res.cookie("accessToken", accessToken, { maxAge: constant.ONE_WEEK });
    res.cookie("refreshToken", refreshToken, { maxAge: constant.ONE_WEEK });

    createData(User, user);
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
  const ref = verify(req.cookies.accessToken);
  // console.log("@@@main", ref);
  // res.cookie("accessToken",res.session.accessToken);
  res.render("main");
});

app.get("/editNft", (req, res) => {
  // console.log("@@@editNft", ref);
  res.render("editNft");
});

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
