class ChatManager {
  constructor() {
    this.currRoomId = "";
    this.roomElements = {};
    this.chatElements = {};
  }
  getCurrRoomId = () => this.currRoomId;
  setCurrRoomId = (roomId) => {
    this.currRoomId = roomId;
  };

  getRooms = (myUid, socket) => {
    return new Promise((resolve, reject) => {
      sendAxios({
        url: "/getRooms",
        data: { uid: myUid },
      }).then(({ data }) => {
        data.forEach((room) => {
          const { room_id, event, member, updatedAt } = room;
          const memberObj = JSON.parse(member);
          const meberImgs = memberObj.map((oneMember) => oneMember.img_url);

          const roomTag = setRoomTag({
            room_id,
            meberImgs,
            event,
            updatedAt,
            memberObj,
          });
          const boxAEl = document.createElement("a");

          boxAEl.innerHTML = roomTag;
          boxAEl.addEventListener("click", (e) => {
            socket.emit({
              event: "leaveChatRoom",
              room_id: this.getCurrRoomId(),
            });

            this.setCurrRoomId(room_id);

            socket.emit({
              event: "joinChatRoom",
              my_uid: myAuth.getUid(),
              my_name: myAuth.getName(),
              room_id: this.getCurrRoomId(),
            });

            console.log("현재 RoomId :", { room_id: this.getCurrRoomId() });
            chat_input.classList.remove("visually-hidden");

            data.forEach((room_target) => {
              document
                .getElementById(`${room_target.room_id}`)
                .classList.remove("active");
            });
            document
              .getElementById(`${this.getCurrRoomId()}`)
              .classList.add("active");
            this.getChat(room_id, myUid);
          });

          this.roomElements[data[0].room_id] = boxAEl;
          userBox.appendChild(boxAEl);
        });
        resolve(this.roomElements);
      });
    });
  };

  getChat = (room_id, myUid) => {
    // console.log("inner getChat", room_id);
    sendAxios({
      url: "/getChats",
      data: { room_id },
    }).then(({ data }) => {
      chatBox.innerHTML = "";
      data.forEach((chat) => {
        const el = document.createElement("div");
        if (myUid === chat.sender) {
          el.innerHTML = setMyChatTag(chat);
        } else {
          el.innerHTML = setYourChatTag(chat);
        }
        chatBox.appendChild(el);
      });
      chatBox.scrollTop = chatBox.scrollHeight;
    });
  };

  addNewChat = (chat, myUid) => {
    const el = document.createElement("div");
    if (myUid === chat.sender) {
      el.innerHTML = setMyChatTag(chat);
    } else {
      el.innerHTML = setYourChatTag(chat);
    }
    chatBox.appendChild(el);
    chatBox.scrollTop = chatBox.scrollHeight;
  };
}

sendChat = ({ room_id, msg }) => {
  // console.log("inner getChat", room_id);
  sendAxios({
    url: "/setChat",
    data: { room_id },
  });
};

function makeUrl(list) {
  let tags = "";
  list.forEach((img_url) => {
    tags += `<img src="${img_url}" alt="user" width="50" height="50" class="rounded-circle" />`;
  });
  return tags;
}

function setRoomTag(data) {
  const { updatedAt, event, meberImgs, room_id } = data;
  const events = JSON.parse(event);
  let msg = "";
  let name = "";
  if (events.length !== 0) {
    msg = events[0].msg;
    name = events[0].name;
  }

  // const { msg, name } = events[0]
  const stringTime = calcTime(updatedAt);

  return `<a id=${room_id} href="#" class="list-group-item list-group-item-action list-group-item-dark  text-white rounded my-1">
      <div class="media">
        ${makeUrl(meberImgs)}
        <div class="media-body ml-4">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <h6 class="mb-0">${name}</h6>
            <small class="small font-weight-bold">${stringTime}</small>
          </div>
          <p class="font-italic text-white mb-0 text-small">
            ${msg}
          </p>
        </div>
      </div>
    </a>`;
}

function calcTime(time) {
  const today = new Date();
  const timeValue = new Date(time);

  const betweenTime = Math.floor(
    (today.getTime() - timeValue.getTime()) / 1000 / 60
  );
  if (betweenTime < 1) return "방금전";
  if (betweenTime < 60) {
    return `${betweenTime}분전`;
  }

  const betweenTimeHour = Math.floor(betweenTime / 60);
  if (betweenTimeHour < 24) {
    return `${betweenTimeHour}시간전`;
  }

  const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
  if (betweenTimeDay < 365) {
    return `${betweenTimeDay}일전`;
  }
  if (`${Math.floor(betweenTimeDay / 365)}` === "NaN") return "방금전";
  return `${Math.floor(betweenTimeDay / 365)}년전`;
}

function setYourChatTag(data) {
  const { img_url, msg, createdAt, not_read, name } = data;
  //console.log("setYourChatTag :", not_read);
  const notRead = JSON.parse(not_read).length;
  const stringTime = calcTime(createdAt);
  return `  <div class="media w-75 mb-3 d-flex me-auto">
  <img src="${img_url}" alt="user" width="50" height="50" class="rounded-circle mx-3" />
  <div class="media-body">
  <p class="text-white">${name}</p>
    <div class="bg-info rounded py-2 px-3 mb-2">
      <p class="text-small mb-0 text-white">
        ${msg}
      </p>
    </div>
    <p class="small text-muted fw-bold">${stringTime}</p>
  </div>
  <p class="small text-muted fw-bold ms-2 text-warning">${notRead}</p>
</div>`;
}

function setMyChatTag(data) {
  const { img_url, msg, createdAt, not_read } = data;
  //console.log("setYourChatTag :", not_read);
  const notRead = JSON.parse(not_read).length;
  const stringTime = calcTime(createdAt);
  return `<div class="media w-75 mb-3 float-end d-flex ms-auto ">
  <p class="small text-muted fw-bold me-2 ms-auto text-warning">${notRead}</p>

  <div class="media-body">
    <div class="bg-primary rounded py-2 px-3 mb-2 ">
      <p class="text-small mb-0 text-white">
       ${msg}
      </p>
    </div>
    <p class="small text-muted fw-bold">${stringTime}</p>
  </div>
  <img src="${img_url}" alt="user" width="50" height="50" class="rounded-circle mx-3" />
</div>`;
}
const myAuth = new Auth();
const chatManager = new ChatManager();
const chatSocket = new ClientSocket("chat");

chatSocket.setConnection(() => {
  console.log("채팅 connect");

  chatSocket.on({
    event: "newChat",
    callback: (data) => {
      console.log("newChat소켓 :", data);
      chatManager.addNewChat(data, myAuth.getUid());
    },
  });
});

myAuth.getAuth().then((myAUth) => {
  console.log("chat myAuth Uid :", myAUth.getUid());

  chatManager.getRooms(myAUth.getUid(), chatSocket).then(() => {
    sendMsg_btn.addEventListener("click", () => {
      const msgText = document.getElementById("send_text").value;
      const sendChat = ({ room_id, msg, img_content }) => {
        sendAxios({
          url: "/sendChat",
          data: { room_id, msg, img_content },
        });
      };

      const sendChatContent = {
        room_id: chatManager.getCurrRoomId(),
        msg: msgText,
      };
      sendChat(sendChatContent);
    });
  });
});
