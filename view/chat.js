sendAxios({
  url: "/getRooms",
  data: { uid: "admin" },
}).then(({ data }) => {
  data.forEach((room) => {
    const { room_id } = room;
    const aEl = document.createElement("a");
    aEl;
    chatBox.appendChild(aEl);

    sendAxios({
      url: "/getChats",
      data: { room_id: room_id },
    }).then(({ data }) => {
      console.log(data);
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
  });
});

function calcTime(time) {
  const date = new Date(time).getTime();
  return date;
}

function setRoomTag(data) {
  const { your_id, updatedAt, event } = data;
  const { msg, uid } = event;
  return `<a class="list-group-item list-group-item-action active text-white rounded my-1">
      <div class="media">
        <img src="/static/image/brand.gif" alt="user" width="50" height="50" class="rounded-circle" />
        <div class="media-body ml-4">
          <div class="d-flex align-items-center justify-content-between mb-1">
            <h6 class="mb-0">${your_id}</h6>
            <small class="small font-weight-bold">${updatedAt}</small>
          </div>
          <p class="font-italic text-white mb-0 text-small">
            내용1 뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨뀨
          </p>
        </div>
      </div>
    </a>`;
}

function setYourChatTag(data) {
  const { img_url, msg, createdAt, not_read } = data;
  const notRead = JSON.parse(not_read).length;
  return `  <div class="media w-75 mb-3 d-flex me-auto">
  <img src="${img_url}" alt="user" width="50" height="50" class="rounded-circle mx-3" />
  <div class="media-body">
    <div class="bg-info rounded py-2 px-3 mb-2">
      <p class="text-small mb-0 text-white">
        ${msg}
      </p>
    </div>
    <p class="small text-muted fw-bold">${calcTime(createdAt)}</p>
  </div>
  <p class="small text-muted fw-bold ms-2 text-warning">${notRead}</p>
</div>`;
}

function setMyChatTag(data) {
  const { img_url, msg, createdAt, not_read } = data;
  const notRead = JSON.parse(not_read).length;
  return `<div class="media w-75 mb-3 float-end d-flex ms-auto ">
  <p class="small text-muted fw-bold me-2 ms-auto text-warning">${notRead}</p>

  <div class="media-body">
    <div class="bg-primary rounded py-2 px-3 mb-2 ">
      <p class="text-small mb-0 text-white">
       ${msg}
      </p>
    </div>
    <p class="small text-muted fw-bold">${calcTime(createdAt)}</p>
  </div>
  <img src="${img_url}" alt="user" width="50" height="50" class="rounded-circle mx-3" />
</div>`;
}
