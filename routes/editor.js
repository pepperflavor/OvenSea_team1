const express = require("express");
const { ChatLog, ChatMember } = require("../model");
const path = require("path");
const router = express.Router();

const chatController = require("../controllers/chat");
const nftController = require("../controllers/nft");

// update , delete, create, select
// nft 등록
router.get("/myPage", nftController.addNFT);
