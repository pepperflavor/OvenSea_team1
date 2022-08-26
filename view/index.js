

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

$.getJSON("/getDatas3", (datas) => {
  dbManager.setData(datas);
  dbManager.createTableEl(table3);
});

const clientSocket = new ClientSocket();

const setDevUser = { uid: createUid(), room: createNftId() };

clientSocket.initEvent({
  uid: setDevUser.uid,
  room: setDevUser.room,
});
clientSocket.initAuction({
  uid: setDevUser.uid,
  room: setDevUser.room,
});
clientSocket.initChat({
  uid: setDevUser.uid,
  room: setDevUser.room,
});

