const eventSocket = new ClientSocket("event");

let onlineUserList = [];

myAuth.getAuth().then((myAUth) => {
  const user = myAUth.getUser();
  eventSocket.emit({
    event: "online",
    user,
  });
  log
});

eventSocket.setConnection(() => {
  console.log("이벤트 connect");

  eventSocket
    .on({
      event: "online",
      callback: (data) => {
        console.log("online", data);
        onlineUserList = data;
        console.log("onlineUserList", onlineUserList);
      },
    })
    .on({
      event: "sleep",
      callback: (data) => {
        console.log("online", data);
        onlineUserList = data;
        console.log("onlineUserList", onlineUserList);
      },
    })
    .on({
      event: "offline",
      callback: (data) => {
        onlineUserList = data;
      },
    });
});
