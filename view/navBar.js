function makeNavBar(auth) {
  console.log(auth);

  const navTag = `<nav class="navbar navbar-expand-lg navbar-dark bg-dark fs-5">
  <div class="container-fluid fs-5">
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo03"
      aria-controls="navbarTogglerDemo03" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <img class="rounded-circle m-auto center me-3 ms-1" src="/static/image/brand.gif" alt="" width="55"
      height="55" />
    <a class="navbar-brand fs-2 fw-bold" href="/">Ovensea</a>

    <div class="d-flex flex-column collapse navbar-collapse" id="navbarTogglerDemo03" style="position:relative">
      <input id="nav_search" class="form-control container-sm w-100 mx-auto bg-dark text-white fs-5 fw-bold" type="search"
        placeholder="Search" aria-label="Search" onkeypress="searchEnter(event)"></input>
        <div id="search_bar" class="list-group collapse  container-sm w-100 mx-auto bg-dark text-white fs-5 fw-bold"  style="position:absolute ; w-100 ; top: 105% ; left:14%; z-index : 99">



          
        </div>
    </div>
    
    <ul class="navbar-nav mb-2 mb-lg-0 fs-5 fw-bold d-none d-lg-flex">
      <li class="nav-item ms-4">
        <a class="nav-link active " aria-current="page" href="/">메인페이지</a>
      </li>
      <li class="nav-item ms-4">
        <a class="nav-link " href="/gallery">갤러리</a>
      </li>
      <li class="nav-item ms-4">
        <a class="nav-link" href="/auction">경매</a>
      </li>
      <li class="nav-item ms-4">
        <a class="nav-link" href="/chat">채팅</a>
      </li>
      <li class="nav-item ${
        auth.isLogin() ? "visually-hidden" : ""
      }" id="loginDiv">
        <a href="/loginPage" class="btn btn-outline-light ms-4 mt-1 fs-6 fw-bold" id="login_btn">로그인</a>
      </li>
      <li class="nav-item ${
        auth.isLogin() ? "visually-hidden" : ""
      }" id="loginDiv">
        <a href="/signup" class="btn btn-outline-light ms-4 mt-1 fs-6 fw-bold" id="login_btn">회원가임</a>
      </li>
    </ul>
    <div class="dropdown text-end ms-4 me-1 float-end <%= !isLogin &&'visually-hidden'%>" id="userDiv">
      <a href="#" class="d-block link-dark text-decoration-none dropdown-toggle text-white ${
        auth.isLogin() ? "" : "visually-hidden"
      }"
        data-bs-toggle="dropdown" aria-expanded="false">
        <img src="${auth.getImgUrl()}" id="my_imgUrl" alt="mdo" width="32" height="32" class="rounded-circle">
      </a>
      <ul class="dropdown-menu text-small" style="transition: 1s all ease-in-out;">
        <li><a class="dropdown-item" href="/profile">내정보</a></li>
        <li><a class="dropdown-item" href="/collection">내컬랙션</a></li>
        <li><a class="dropdown-item" href="/editNft">NFT발행하기</a></li>
        <li><a class="dropdown-item" href="/chat">채팅창</a></li>
        <li>
          <hr class="dropdown-divider">
        </li>
        <li><a class="dropdown-item" href="/logout">로그아웃</a></li>
      </ul>
    </div>
  </div>
</nav>`;
  const navBar = document.getElementById("navbar");
  navBar.innerHTML = navTag;
  const navSearch = document.getElementById("nav_search");
  const searchBar = document.getElementById("search_bar");

  navSearch.addEventListener("click", () => {
    searchBar.classList.toggle("show");
  });
  navSearch.addEventListener("focusout", () => {
    setTimeout(() => {
      const searchBar = document.getElementById("search_bar");
      searchBar.innerHTML=""
      searchBar.classList.toggle("show");
    }, 500);

    navSearch.addEventListener("change", () => {
      const searchWord = navSearch.value;
      sendAxios({
        url: "/search",
        data: { searchWord },
      }).then(({ data }) => {
        const searchBar = document.getElementById("search_bar");
        searchBar.innerHTML=""
        makeSearchResultBar(data);
        searchBar.classList.toggle("show")
      });
    });
  });
}

function searchEnter(e) {
  const navSearch = document.getElementById("nav_search");
  if (e.keyCode == 13) {
    const searchWord = navSearch.value;
    sendAxios({
      url: "/search",
      data: { searchWord },
    }).then(({ data }) => {
      const searchBar = document.getElementById("search_bar");
      searchBar.innerHTML=""
      makeSearchResultBar(data);
      searchBar.classList.add("show")
    });
  }
}

function makeSearchResultBar(results) {
  const bar = [];
  const searchBar = document.getElementById("search_bar");
  results.forEach((result) => {
    const { id, nft_img, title, content } = result;
    const newDiv = document.createElement("div");
    const resultBar = `<a href="/nftPage/${id}" class="list-group-item list-group-item-action">
                    <img src="${nft_img}" id="my_imgUrl" alt="mdo" width="50" height="50" class="rounded-circle">
                    <h4> ${title}</h4> 
                    <p> ${content}</p> 
                    </a>`;
    newDiv.innerHTML = resultBar;
    searchBar.appendChild(newDiv);
  });
}

myAuth.getAuth().then(() => {
  makeNavBar(myAuth);
});
