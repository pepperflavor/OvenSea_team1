// const ChatMember = require('../models/chatMember');
// const ChatLog = require('../models/chatlog');

// // // navigator에서 chatting 눌렀을때 여기로
// // exports.getAddChatMember = (req, res, next) => {
// //     //let roomtype = req.params.page; // url 받아와서 roomtype으로 집어넣기
// //     res.render('/chat/add-chatmember', 
// //     {
// //       pageTittle: "채팅방 입장페이지",
// //       path : '/chat/add-chatmember',
// //       formsCSS: true,
// //     });
// // };

// // 테이블에 새 채팅 참여자 추가
// exports.postAddChatMember = (req, res, next) =>{
//   let roomtype = 1;
//   // ChatMember에 새 채팅 참여자 컬럼추가
//   ChatMember.create({
//     uid: createUid(),
//     roomtype: roomtype,
//   }).then(result => {
//     console.log(result);
//   }).catch(err =>{
//     console.log(err);
//   })
// }

// // 채팅참여자 제거
// exports.postDeletechatMember = (req, res, next) =>{

// };



// // 채팅내용 저장
// // const chat = req.params.input_box;