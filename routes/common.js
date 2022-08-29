const { Router } = require("express");
const { ChatLog, ChatMember } = require("../model");
const path = require('path');
const router = express.Router();

const chatController = require('../controllers/chat');

// 채팅 받을 배열
const chat = [];


// enterSchat에서 입장버튼 눌렀을 때 방번호 받아오기
router.get("/chatEnter", chatController.addChatMember);




// // free chat에서 유저 접속시간 비교를 위해서 시간 뽑아오기
// app.get("/freechat",  (req, res) =>{
//   FreeChat.findOne({
//     where: {
//       created_at : req.params.created_at,
//     },
//     include: [
//       {
//         model : chat_member,
//       },
//     ],
//   }).then((e)=>{
//     console.log(e.dataValues); 
//   })
// });

// 404 페이지
app.use((req, res, next)=> {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

module.exports = router;
//let page = req.params.page;

// let page = req.params.page; 경로 값 받아오기

