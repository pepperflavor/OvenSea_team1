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
const EventManager = require("./util/eventManager");
const {
  initDb,
  createData,
  findAllData,
  findData,
  updateData,
  deleteData,
} = require("./util/dbManager");
const { Op } = require("sequelize");
const { send } = require("process");
const app = express();

const onlineUser = new Json([{ uid: "", name: "", state: "", img_url: "" }]);

const PORT = 3000;

// // join함수는 매개변수를 받아 주소처럼 합쳐줌
// // path.join('a','b') => "a/b"
// // views 폴더까지의 경로가 기본값 렌더링할 파일을 모아둔 폴더
// // app.set express에 값을 저장가능 밑에 구문은 view키에 주소값의 부분
const server = app.listen(PORT, () => {
  console.log(PORT, "포트 연결");
});

// initDb();
initDb("init");

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

event.setConnection(() => {
  event.on({
    event: "online",
    callback: ({ user }) => {
      /**
       *  {uid     : "uid" ,
       *   name    : "userName"
       *   status  : "접속중",
       *   img_url : "sdf", }
       * */

      if (user !== {}) {
        if (onlineUser.isEmpty()) onlineUser.initJson(user);
        const { isExist } = onlineUser.find(({ uid }) => uid === user.uid);

        console.log(isExist);
        if (!isExist) onlineUser.push(user);

        console.log("온라인 리스트", onlineUser);
        const json = onlineUser.jsontoString();
        console.log("온라인 리스트", json);
        event.toEmit({ to: "all", event: "online", users: `${json}` });
      }
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

app.post("/getOnlineUser",  (req, res) => {
  res.send({ users: onlineUser.jsontoString() });
});

app.post("/createRoom", async (req, res) => {
  const { member } = req.body; //member : {uid, name, img_url, msg}

  const members = new Json(member);

  const room_id = createNftId();
  const event = {
    uid: members.original[0].uid,
    name: members.original[0].name,
    img_url: members.original[0].img_url,
    msg: "",
  };
  const _member = members.original.map(({ uid, name, img_url }) => {
    return { uid, name, img_url };
  });
  const _event = new Json().initJson(event);
  const _memberJson = new Json(_member);

  const data = await createData(Room, {
    room_id,
    event: _event.jsontoString(),
    member: _memberJson.jsontoString(),
  });

  const uids = members.original.map(({ uid }) => uid);

  await uids.forEach(async (uid) => {
    const user = await findData(User, { where: { uid } });
    const json = new Json(user.rooms);
    json.push({ room: room_id });
    const users = await updateData(
      User,
      { rooms: json.jsontoString() },
      { where: { uid } }
    );
  });
  res.send(data);
});

app.post("/addRank", (req, res) => {
  const { score, nickname } = req.body;

  console.log(`addRank 닉네임 : ${nickname}, 스코어 ${score}`);

  res.send({ score, nickname });
});

app.get("/", async (req, res) => {
  const { accessToken, refreshToken, viewToken } = req.cookies;
  const { ok, user } = verify(refreshToken, "refresh");

  if (!viewToken)
    res.cookie(" viewToken", createUid(), { maxAge: constant.ONE_DAY });

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

app.post("/search", async (req, res) => {
  const { searchWord } = req.body;
  const data = await findAllData(Nft, {
    where: {
      title: {
        [Op.like]: "%" + searchWord + "%",
      },
    },
  });
  res.send(data);
});

app.post("/upLikeNft", async (req, res) => {
  try {
    let likeLength;

    const { id } = req.body;

    const { refreshToken } = req.cookies;

    const { ok, user } = verify(refreshToken, "refresh");

    const { like } = await findData(Nft, { where: { id } });

    if (ok) {
      // const nft = await Nft.findOne({ where: { id } });
      //const { like } = nft.dataValues;

      const likeJson = new Json(like);
      likeJson.bind(async (like) => {
        const isEmpty = like.isEmpty();
        const { isExist } = like.find(({ name }) => name == user.name);

        if (isEmpty) {
          like.initJson({ name: user.name });
          await updateData(
            Nft,
            { like: like.jsontoString() },
            { where: { id } }
          );
          likeLength = like.length();
          res.send(`${likeLength}`);
        } else {
          if (!isExist) {
            like.push({ name: user.name });
            likeLength = like.length();
            await updateData(
              Nft,
              { like: like.jsontoString() },
              { where: { id } }
            );
            res.send(`${likeLength}`);
          } else {
            likeLength = like.length();
            res.send(`${likeLength}`);
          }
        }
      });
    } else {
      res.send(`${likeLength}`);
    }
  } catch (err) {
    console.log(err);
    res.send(`${likeLength}`);
  }
});

app.get("/nftPage/:id", async (req, res) => {
  try {
    let viewLength;
    let likeLength = 0;

    const { id } = req.params;

    const { refreshToken, viewToken } = req.cookies;

    if (!viewToken)
      res.cookie(" viewToken", createUid(), { maxAge: constant.ONE_DAY });

    const { ok, user } = verify(refreshToken, "refresh");

    // console.log(id);

    const nft = await Nft.findOne({ where: { id } });

    if (nft?.dataValues) {
      const { view, like, id } = nft?.dataValues;
      const viewJson = new Json(view);
      viewJson.bind((view) => {
        const isEmpty = view.isEmpty();
        const { isExist } = view.find(({ name }) => name === viewToken);

        if (isEmpty) {
          view.initJson({ name: viewToken });
        } else {
          if (!isExist) view.push({ name: viewToken });
        }

        viewLength = view.length();
      });
      const view1 = await updateData(
        Nft,
        { view: viewJson.jsontoString() },
        { where: { id } }
      );

      const likeJson = new Json(like);
      const { isExist } = likeJson.find(({ name }) => name === user?.name);
      if (isExist) likeLength = likeJson.length();
      console.log(isExist);

      const nftData = {
        viewLength,
        likeLength,
        isLike: false,
        ...nft.dataValues,
      };
      // console.log({ user, ...nftData, isLogin: true });

      if (ok) {
        console.log({ user, ...nftData, isLogin: true });
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
  const { refreshToken, viewToken } = req.cookies;
  const { user } = verify(refreshToken, "refresh");
  res.send({ ...user });
});

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

    //console.log("@@getRooms :", roomResult);
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
  res.cookie("viewToken", "", { maxAge: 0 });
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
