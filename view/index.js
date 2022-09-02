document.onload = () => {};
const dbManager = new DbManager();
$.getJSON("/getDatas", (datas) => {
  dbManager.setData(datas);
  dbManager.createTableEl(table, ["balance", "uid", "grade"]);
});

$.getJSON("/getDatas2", (datas) => {
  dbManager.setData(datas);
  dbManager.createTableEl(table2);
});

const emailExist = document.getElementById("email_exist");
const signupEmail = document.getElementById("signup_email");

signupEmail.addEventListener("change", (e) => {
  if (e.target.value !== "") {
    const params = new URLSearchParams();
    const headers = {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "*/*",
    };
    params.append("user_email", e.target.value);
    axios
      .post("/existEmail", params, {
        headers,
      })
      .then(function (response) {
        const {
          data: { msg },
        } = response;
        emailExist.innerHTML = msg;
      });
  } else {
    e.target.value = "";
  }

  // $.ajax({
  //   url: "/existEmail",
  //   method: "POST",
  //   data: sendData,
  //   contentType: "application/json; charset=UTF-8",
  //   dataType: "json",
  //   success: function (datas) {
  //     console.log("@@@@@@@@", datas);
  //     emailExist.innerHTML = datas.msg;
  //   },
  // });
  
});

// $.getJSON("/getDatas3", (datas) => {
//   dbManager.setData(datas);
//   dbManager.createTableEl(table3);
// });

// const auction = new ClientSocket("auction");
// auction.init();
// auction.on({ type: "뀨" }, (data) => {
//   console.log("뀨 이미터 전소옹!", data);
// });

// setInterval(() => {
//   auction.emit({ type: "뀨", room: "뀨" });
//   // console.log("@@@", auction.getNsp());
// }, 1000);

// setInterval(() => {
//   console.log("chat & emit");
//   chat.emit("test", { chat: "chat", otc: 123123123 });
//   auction.emit("test", { auction: "auction", otc: 3213123123 });
//   auction.emit("test1", { auction: "auction", otc: 3213123123 });
// }, 888);

const auction = new ClientSocket("auction");
const chat = new ClientSocket("chat");
const event = new ClientSocket("event");

// chat.on({
//   event: "connect",
//   callback: () => {
//     // chat.emit({
//     //   event: "toEmit",
//     //   msg: "뀨@@@@@@@@@@@@",
//     //   to: [chat.io.id, "vEFoEZAwIKrm_q2DAAAJ", "2", "1"],
//     //   callbefore: () => {
//     //     console.log("toEmit : 발송");
//     //   },
//     // });

//     chat.on({
//       event: "toEmit",
//       callback: (data) => {
//         console.log(data, "send 감지!");
//       },
//     });
//   },
// });
auction.setConnection(() => {
  console.log("connect");

  auction.on({
    event: "toEmit",
    callback: (data) => {
      console.log(data, "send 감지!");
    },
  });
});

chat.setConnection(() => {
  console.log("connect");

  chat.on({
    event: "toEmit",
    callback: (data) => {
      console.log(data, "send 감지!");
    },
  });
});

setInterval(() => {
  auction.emit({
    event: "뀨",
    otc: 3213123123,
    callbefore: () => {
      console.log("auction : 뀨 발송");
    },
  });
  chat.emit({
    event: "뀨",
    otc: 123123123,
    callbefore: () => {
      console.log("chat : 뀨 발송");
    },
  });
}, 1000);
