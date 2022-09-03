



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