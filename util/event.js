const eventSocket = new ClientSocket("event");
let onlineUserList = [];

myAuth.getAuth().then((myAuth) => {
  const user = myAuth.getUser();
  console.log("online 이밋 전에 데이터 user:", user);
  eventSocket.emit({
    event: "online",
    user,
  });
});

eventSocket.setConnection(() => {
  console.log("이벤트 connect");

  eventSocket
    .on({
      event: "online",
      callback: ({users}) => {
        console.log("online", users);
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
