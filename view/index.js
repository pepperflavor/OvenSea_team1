

const myAuth = new Auth()

// console.log(myAuth.getUid()); 


function getNftBrands() {
  return new Promise((resolve, reject) => {
    sendAxios({
      url: "/getNftBrands",
      data: {},
    }).then(({ data }) => {
      resolve(data);
    });
  });
}
function getNfts() {
  return new Promise((resolve, reject) => {
    sendAxios({
      url: "/getNfts",
      data: {},
    }).then(({ data }) => {
      resolve(data);
    });
  });
}

function makeBannerIndicators(idx) {
  const el = `<button type="button" data-bs-target="#myCarousel" data-bs-slide-to="${idx}" class="${
    idx === 0 ? "active" : ""
  }" aria-current="true"
  aria-label="Slide ${idx + 1}"></button>`;
  return el;
}

function makeBanner(data) {
  const { brand_id, img_url, editor_uid, content, brand_name } = data;
  const bannerTag = `
        <img src="${img_url}" alt height="550" style="filter: brightness(50%);"/>
        <div class="container">
          <div class="carousel-caption text-start my-4 text-light tw-bold">
            <h1>${brand_name}</h1>
            <p class="my-4">${content}</p>
            
          </div>
        </div>`;
  return bannerTag;
}

function makeNft(data) {
  const { title, img_url, onwer, content, brand_name } = data; //<div class="col">
  const tag = `
        <a href="#" class="img_cell text-decoration-none view overlay zoom">
          <div class="card bg-secondary">
            <img id="img_url_example" class="p-2 my-3 rounded-4 shadow m-auto center" src="${img_url}"
              alt="" width="265" height="265">
            <div class="card-body bg-secondary">
              <h2 class="card-text text-white my-3">${title}</h2>
              <p class="card-text text-white my-3">${content}</p>
              
            </div>
          </div>
        </a>
                `; //</div>

  return tag;
}

getNfts().then((datas) => {
  datas.forEach((data, idx) => {
    const ntfTag = makeNft(data);
    const newNftWrap = document.createElement("div");
    newNftWrap.classList.add("col");
    newNftWrap.innerHTML = ntfTag;
    newNftWrap.addEventListener("click",()=>{
      const {id} = data
      document.location.href = `/nftPage/${id}`
    })
    nftContainer.appendChild(newNftWrap)
  });
});

getNftBrands().then((datas) => {
  datas.forEach((data, idx) => {
    const bannerTag = makeBanner({ idx, ...data });
    const indicators = makeBannerIndicators(idx);
    const newBannerWrap = document.createElement("div");
    newBannerWrap.style = newBannerWrap.classList.add("carousel-item");
    if (idx === 0) newBannerWrap.classList.add("active");
    newBannerWrap.innerHTML = bannerTag;
    banner.appendChild(newBannerWrap);
    bannerIndicators.innerHTML += indicators;
  });
});

// const img_cell = document.querySelector(".img_cell");
// img_cell.addEventListener("mouseover", (e) => {
//   console.log(e.target);
//   // document.getElementById().childNodes
// });



// $.getJSON("/getDatas3", (datas) => {
//   dbManager.setData(datas);
//   dbManager.createTableEl(table3);
// });

// const auction = new ClientSocket("auction");
// auction.init();
// auction.on({ type: "뀨" }, (data) => {
//   console.log("뀨 이미터 전소옹!", data);
// });

// setInterval(() => {
//   auction.emit({ type: "뀨", room: "뀨" });
//   // console.log("@@@", auction.getNsp());
// }, 1000);

// setInterval(() => {
//   console.log("chat & emit");
//   chat.emit("test", { chat: "chat", otc: 123123123 });
//   auction.emit("test", { auction: "auction", otc: 3213123123 });
//   auction.emit("test1", { auction: "auction", otc: 3213123123 });
// }, 888);

const auction = new ClientSocket("auction");
const event = new ClientSocket("event");

// chat.on({
//   event: "connect",
//   callback: () => {
//     // chat.emit({
//     //   event: "toEmit",
//     //   msg: "뀨@@@@@@@@@@@@",
//     //   to: [chat.io.id, "vEFoEZAwIKrm_q2DAAAJ", "2", "1"],
//     //   callbefore: () => {
//     //     console.log("toEmit : 발송");
//     //   },
//     // });

//     chat.on({
//       event: "toEmit",
//       callback: (data) => {
//         console.log(data, "send 감지!");
//       },
//     });
//   },
// });
auction.setConnection(() => {
  console.log("connect");

  auction.on({
    event: "toEmit",
    callback: (data) => {
      console.log(data, "send 감지!");
    },
  });
});

// setInterval(() => {
//   auction.emit({
//     event: "뀨",
//     otc: 3213123123,
//     callbefore: () => {
//       console.log("auction : 뀨 발송");
//     },
//   });
//   chat.emit({
//     event: "뀨",
//     otc: 123123123,
//     callbefore: () => {
//       console.log("chat : 뀨 발송");
//     },
//   });
// }, 1000);
