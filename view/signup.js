[1, 2, 3, 4, 5, 6, 7, 8, 8, 9, 10, 11, 12, 13].forEach((num) =>
  document.getElementById(`img_${num}`).addEventListener("click", () => {
    document.getElementById(`img_url`).value =
      "/static" + document.getElementById(`img_${num}`).src.split("/static")[1];
    document.getElementById("img_url_example").src =
      "/static" + document.getElementById(`img_${num}`).src.split("/static")[1];
  })
);
const emailExist = document.getElementById("email_exist");
const signupEmail = document.getElementById("signup_email");

signupEmail.addEventListener("change", (e) => {
  if (e.target.value !== "") {
    const params = new URLSearchParams();
    const headers = {
      "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "*/*",
    };
    params.append("user_email", e.target.value);
    axios
      .post("/existEmail", params, {
        headers,
      })
      .then(function (response) {
        const {
          data: { msg },
        } = response;
        emailExist.innerHTML = msg;
      });
  } else {
    e.target.value = "";
  }
});