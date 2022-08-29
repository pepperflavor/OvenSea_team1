// 채팅관련 

// 테이블에 새로 추가
exports.getAddChatMember = (req, res, next) => {
  let roomtype = req.params.page; // url 받아와서 roomtype으로 집어넣기
  res.render("chatEnter", {
    pageTittle: "채팅방 입장페이지",
    formsCSS: true,
  });
  // ChatMember에 새 채팅 참여자 컬럼추가
  ChatMember.create({
    uid: createUid(),
    roomtype: roomtype,
  });
}


// 룸타입에 따라 페이지 이동시켜주기
exports.postChatMember = (req, res, next) => {
  let roomtype = req.params.page; // url 받아와서 roomtype으로 집어넣기
  if (roomtype == 1) {
    res.redirect("./freeChat");
  } else if (roomtype == 2) {
    res.redirect("./auction");
  }
};


// 채팅내용 저장
// const chat = req.params.input_box;
