
const nft = [];


// nft (생성)추가하기 editor 기능
exports.addNFT = (req, res, next) => {
  const nftTitle = req.params.nftTitle;
};


// nft 조회 내가 소유한 NFT 불러오기 url에서 동적으로 id값 얻기
exports.getMyNFT = (req, res, next) =>{
    const nftId = req.params.nftId;
    res.redirect('/');
}

// exports.createNFT = (req, res, next)=>{
//     const nftTitle = req.params.nftTitle;
// }

// 갤러리에 모든 nft 보여주기
exports.getNFT


// nft 수정


// nft 삭제
