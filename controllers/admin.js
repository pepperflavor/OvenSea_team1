const { Nft } = require("../models");
const { create } = require("../models/nfts");
const nft = require("../models/nfts");
const { createNftId } = require("../util/createRandom");

// nft 등록 접근
exports.getAddNft = (req, res, next) => {
  console.log("@@@@@@@",req);
  res.render("/admin/edit-nft", {
    PageTitle: "Add NFT",
    path: "/admin/add-nft",
    editing: false,
    isAuthenticated: req.isLoggedIn,
  });
};

// nft 등록
exports.postAddNft = (req, res, next) => {
  console.log("@@@@@@@", req);
  const nftUid = createNftId();
  const title = req.body.title;
  const price = req.body.price;
  const content = req.body.nft_content;
  const owner = req.body.nft_owner;
  const imgUrl = req.body.imgUrl;

  Nft.create({
    nftUid: nftUid,
    imgUrl: imgUrl,
    title: title,
    price: price,
    content: content,
    owner: owner,
  });
};

// nft 조회
exports.getNft = (req, res, next) => {
  // model exports 한 이름.찾을 조건
  console.log("@@@@@@@", req);
  Nft.find()
    .then((nfts) => {
      console.log(nfts);
      res.render("admin/nfts", {
        nft: nfts,
        PageTitle: "NFT List",
        path: "admin/nfts",
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// 수정 ****** 페이지 만들어지면 값 받아오도록 수정
exports.postEditNft = (req, res, next) => {
  //const title = req.body.title;
  // 조회할 nft는 선택할 때 해당 nft의 id값을 담아서 보내도록 만들어야함
  const nftId = req.body.id;
  const updateTitle = req.body.title;
  const updatePrice = req.body.price;
  const updateContent = req.body.nft_content;
  const updateOwner = req.body.nft_owner;
};


// nft 조회
exports.getEditNft = (req, res, next) => {
  console.log("@@@@@@@@", req);
  const editMode = req.body.title;
  if (!editMode) {
    return res.redirect("/index");
  }
  const title = req.params.title;
  Nft.findById(title)
    .then((nft) => {
      if (!nft) {
        return res.redirect("/index");
      }
      res.render("admin/edit-nft", {
        pageTitle: "Edit NFT",
        path: "/admin/edit-product",
        editing: editMode,
        title: title,
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

// 삭제
exports.postDeleteNft = (req, res, next) => {
  const title = req.body.title;
  Nft.findByIdAndRemove(title)
    .then(() => {
      console.log("DESTROYED NFT");
      res.redirect("/admin/nfts");
    })
    .catch((err) => console.log(err));
};
