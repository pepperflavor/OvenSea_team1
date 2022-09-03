
const makeParams = (data) => {
  const dataObj = { ...data };
  const params = new URLSearchParams();
  const headers = {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "*/*",
  };

  for (const [key, data] of Object.entries(dataObj)) {
    params.append(key, data);
  }

  return { params, headers };
};

/**
 *
 * @param {Object} objData
 * @return {PromiseLike}
 */
const sendAxios = async (objData) => {
  const { url, data } = objData;
  const { params, headers }  = makeParams(data);
  return axios.post(url, params, { headers });
};

//if (e.target.value !== "") {
//  const params = new URLSearchParams();
//  const headers = {
//    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
//    Accept: "*/*",
//  };
//  params.append("user_email", e.target.value);
//  axios
//    .post("/existEmail", params, {
//      headers,
//    })
//    .then(function (response) {
//      const {
//        data: { msg },
//      } = response;
//     emailExist.innerHTML = msg;
//    });
//} else {
//  e.target.value = "";
//}

// const testObj = {
//   uid: "admin1",
//   pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
//   name: "admin1",
//   email: "admin@naver.com",
//   balance: 987654321098765,
//   grade: 2,
//   state: 0,
// };

// const { params, headers } = makeParams(testObj);

// sendAxios({ params, headers, url: "/getNfts" }).then(() => {});

// console.log(params);
