const axios = require("axios");

const makeParams = (data) => {
  const dataObj = { ...data };
  const params = new URLSearchParams();

  for (const [key, data] of Object.entries(dataObj)) {
    params.append(key, data);
  }

  return { params };
};

// 자동으로 데이터 래핑해주는 함수
const sendAxios = async (objData) => {
  const { url, data } = objData;
  const { params } = makeParams(data);
  const headers = {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "*/*",
  };
  return axios.post(url, params, { headers });
};
sendAxios({
  url: "http://192.168.0.206:3000/addRank",
  data: { score: 123, user: "뀨" },
})
  .then(({data}) => {
    console.log(data);
  })
  .catch((err) => {
    console.log(err);
  });
// document.getElementById("ggyu").addEventListener("click", function () {});
