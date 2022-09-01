const express = require("express");
const path = require("path");
const router = express.Router();

const adminController = require("../controllers/admin");



// update , delete, create, select


// nft 등록
router.get("/edit-nft", adminController.postAddNft);

// // nft 이름으로 조회
// router.get("/edit-nft/:title", adminController.getEditProduct);

// nft 수정
router.post("/edit-nft", adminController.postEditNft);

// nft 삭제
router.post("/delete-nft", adminController.postDeleteNft);

module.exports = router;