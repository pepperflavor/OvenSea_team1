brand.addEventListener("click", () => {
  document.getElementById("img_url").value =
    "/static" + brand.src.split("/static")[1];
  document.getElementById("img_url_example").src =
    "/static" + brand.src.split("/static")[1];
});
turn.addEventListener("click", () => {
  document.getElementById("img_url").value =
    "/static" + turn.src.split("/static")[1];
    document.getElementById("img_url_example").src =
      "/static" + turn.src.split("/static")[1];
});
cry.addEventListener("click", () => {
  document.getElementById("img_url").value =
    "/static" + cry.src.split("/static")[1];
    document.getElementById("img_url_example").src =
      "/static" + cry.src.split("/static")[1];
});
cat.addEventListener("click", () => {
  document.getElementById("img_url").value =
    "/static" + cat.src.split("/static")[1];
    document.getElementById("img_url_example").src =
      "/static" + cat.src.split("/static")[1];
});
