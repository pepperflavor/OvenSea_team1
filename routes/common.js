const express = require("express");
const { ChatLog, ChatMember } = require("../model");
const path = require('path');
const router = express.Router();

const chatController = require('../controllers/chat');
const nftController = require('../controllers/nft');

// 채팅 받을 배열
const chat = [];

//=======================NFT 관련 시작
// nft 등록은 editor에 있음


// nft 삭제 이렇게 구체적인 기능의 라우터는 동적라우터 보다 위에 작성해야함
router.get("/myPage/:delete");

// ntf 조회  myPage 에서 nft uid에 따라 페이지 로딩이 달라짐
router.get("/myPage/:nftId", nftController.getMyNFT);



////////////===================== NFT 끝






//========================== CHAT 시작


// enterSchat에서 입장버튼 눌렀을 때 방번호 받아오기
// router.get("/chatEnter", chatController.addChatMember);

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
router.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Page Not Found" });
});

module.exports = router;
//let page = req.params.page;

// let page = req.params.page; 경로 값 받아오기

