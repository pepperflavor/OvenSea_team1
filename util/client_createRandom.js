const UPPER_TABLE = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "W",
  "X",
  "Y",
  "Z",
];
const LOWER_TABLE = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "w",
  "x",
  "y",
  "z",
];

const NUM_TABLE = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const RANDOM_TABLE = [...UPPER_TABLE, ...NUM_TABLE, ...LOWER_TABLE];

const RANDOM_SIZE = RANDOM_TABLE.length;

const UID_SIZE = 24;

const NFT_ID_SIZE = 30;

const timestamps = new Date();

// 1일단위의 timestamp를 얻기 위한 상수
//              1초   60초 60분  24시간
const ONE_DAY = 1000 * 60 * 60 * 24;

// 과거의 uid가 겹치는것을 방지하기위해 (24자리)
// 하루단위의 timestamp를 앞에 추가     ( 5자리)
const toDay = Math.floor(timestamps / ONE_DAY);

// 29자리 랜덤 uid 리턴
const createUid = () => {
  const uid = [];
  for (let idx = 0; idx < UID_SIZE; idx++) {
    const random = Math.floor(Math.random() * RANDOM_SIZE);
    uid.push(RANDOM_TABLE[random]);
  }
  // 1일 단위 timestamp 5자리와 24자리 무작위 문자를 합침
  return uid.join("") + toDay;
};

const createNftId = () => {
  const uid = [];
  for (let idx = 0; idx < NFT_ID_SIZE; idx++) {
    const random = Math.floor(Math.random() * RANDOM_SIZE);
    uid.push(RANDOM_TABLE[random]);
  }
  // 1일 단위 timestamp 5자리와 24자리 무작위 문자를 합침
  return uid.join("") + toDay;
};

// module.exports = { createUid, createNftId };
