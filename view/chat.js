class ChatManager {
  constructor() {
    this.currRoomId = "";
  }
}

const chatManager = new ChatManager()

let room_id = 0;

sendMsg_btn.addEventListener("click",()=>{
  const sendText = document.getElementById("send_text").value 
})

sendAxios({
  url: "/getRooms",
  data: { uid: "admin" },
}).then(({ data }) => {
  chatManager.currRoomId = data[0].room_id;
  data.forEach((room) => {
    const { room_id, event, member, updatedAt } = room;
    const meberImgs = JSON.parse(member).map((oneMember) => oneMember.img_url);

    const roomTag = setRoomTag({ room_id, meberImgs, event, updatedAt });
    const aEl = document.createElement("a");

    aEl.innerHTML = roomTag;
    aEl.addEventListener("click", (e) => {
      const tags = data.map((room_target) => {
        document
          .getElementById(`${room_target.room_id}`)
          .classList.remove("active");
      });
      document.getElementById(`${chatManager.currRoomId}`).classList.add("active");
      setChat(room_id);
    });
    userBox.appendChild(aEl);
  });
});

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

  return `<a id=${room_id} href="#" class="list-group-item list-group-item-action list-group-item-dark text-white rounded my-1">
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

function setChat(room_id) {
  // console.log("inner setChat", room_id);
  sendAxios({
    url: "/getChats",
    data: { room_id },
  }).then(({ data }) => {
    chatBox.innerHTML = "";
    data.forEach((chat) => {
      const myUid = "admin";
      const el = document.createElement("div");
      if (myUid === chat.sender) {
        el.innerHTML = setMyChatTag(chat);
      } else {
        el.innerHTML = setYourChatTag(chat);
      }
      chatBox.appendChild(el);
    });
  });
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

  return `${Math.floor(betweenTimeDay / 365)}년전`;
}

function setYourChatTag(data) {
  const { img_url, msg, createdAt, not_read, name } = data;
  const notRead = JSON.parse(not_read).length;
  const stringTime = calcTime(createdAt);
  return `  <div class="media w-75 mb-3 d-flex me-auto">
  <img src="${img_url}" alt="user" width="50" height="50" class="rounded-circle mx-3" />
  <div class="media-body">
  ${name}
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
