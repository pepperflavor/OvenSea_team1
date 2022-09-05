const { createUid, createNftId } = require("./createRandom");
const {
  sequelize,
  User,
  Post,
  Nft,
  Room,
  Chat,
  NftBrand,
} = require("../model");
const constant = require("../model/constants");
const { sign } = require("./jwt_util");

function initDb(option = "normal") {
  const typeArr = {
    init: { force: true, switchInit: true },
    normal: { force: false, switchInit: false },
  };

  const { force, switchInit } = typeArr[option];

  sequelize
    .sync({ force })
    .then(async () => {
      //console.log("DB연결 성공");
      if (switchInit) initData();
    })
    .catch((err) => {
      console.log(err);
    });
}

async function initData() {
  const nfts = [createUid(), createUid(), createUid(), createUid()];
  const userNfts = [createUid(), createUid(), createUid(), createUid()];
  const rooms = [createUid(), createUid(), createUid(), createUid()];

  await User.bulkCreate([
    {
      uid: "admin",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "admin",
      email: "admin@naver.com",
      balance: 987654321098765,
      grade: constant.ADMIN_GRADE,
      img_url: "/static/image/cat.png",
      state: 0,
      rooms: JSON.stringify([...rooms]),
      refresh_token: sign("admin"),
      gallery: JSON.stringify([...nfts]),
    },
    {
      uid: "user1",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user1",
      email: "user1@naver.com",
      balance: 987654321098765,
      grade: constant.EDITOR_GRADE,
      img_url: "/static/image/turn.gif",
      state: 0,
      rooms: JSON.stringify([rooms[0], rooms[2]]),
      refresh_token: sign("user1"),
      gallery: JSON.stringify([...userNfts]),
    },
    {
      uid: "user2",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user2",
      email: "user2@naver.com",
      balance: 987654321098765,
      grade: constant.NORMAL_GRADE,
      img_url: "/static/image/brand.gif",
      state: 0,
      rooms: JSON.stringify([rooms[0], rooms[1]]),
      refresh_token: sign("user2"),
      gallery: JSON.stringify([]),
    },
    {
      uid: "user3",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user3",
      email: "user3@naver.com",
      balance: 987654321098765,
      grade: constant.NORMAL_GRADE,
      img_url: "/static/image/turn.gif",
      state: 0,
      rooms: JSON.stringify([rooms[0], rooms[2]]),
      refresh_token: sign("user3"),
      gallery: JSON.stringify([]),
    },
    {
      uid: "user4",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user4",
      email: "user3@naver.com",
      balance: 987654321098765,
      grade: constant.NORMAL_GRADE,
      img_url: "/static/image/brand.gif",
      state: 0,
      refresh_token: sign("user4"),
      gallery: JSON.stringify([]),
    },
    {
      uid: "user5",
      pwd: "$2b$10$3q1d0sraTQ6OUOuCXP4yjOqHdZBiSqiciyIwXHbAQksu956Hio/zS",
      name: "user5",
      email: "user3@naver.com",
      balance: 987654321098765,
      grade: constant.NORMAL_GRADE,
      img_url: "/static/image/brand.gif",
      state: 0,
      refresh_token: sign("user5"),
      gallery: JSON.stringify([]),
    },
  ]);
  await NftBrand.bulkCreate([
    {
      brand_id: "PartyPenguinsContract",
      brand_name: "Party Penguins",
      img_url:
        "https://lh3.googleusercontent.com/gcMFBRjFtN-da5hbJqF6jywE31xbpc3oE6or4LjHQxoVpfP4N78aVe0XdleVI5l-Ech04EKom79kDLsAwHlbBwJqEIV57rxpXYgaVQo=h600",
      content:
        "Party Penguins is an NFT collection of 9,999 unique and flippin' cool penguins. They’ve moved from Antarctica to the Ethereum blockchain, because that’s where the real party is! Visit www.partypenguins.club to learn more.",
      editor_uid: "user1",
    },
    {
      brand_id: "펭귄조아",
      brand_name: "펭귄조아",
      img_url:
        "https://lh3.googleusercontent.com/13g3FRwKuCmawyeH_rN5VwYbQZ8KrWdN8IZf4_uKJ3IeLjligIY7ZZ_HR7b48RKUJuUfevFTMzxFJcBWdn51TyZVoAXNPqh1TCIprw=h600",
      content:
        "펭귄만 그림 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 귀여웡 펭귄조아 펭귄조아 펭귄조아 펭귄조아 펭귄조아 펭귄조아 펭귄조아",
      editor_uid: "user2",
    },
    {
      brand_id: "피닐리아",
      brand_name: "피닐리아",
      img_url:
        "https://lh3.googleusercontent.com/2yxEzSzTzCzRwhi9HE5vZMI-2seqe0koChnBkuTBZ4q-N8O5whASxH0U2Y92ISrcc_wBqYR8usrFSoJ0QnRvKg8fM1UAyf4l3ArULQ=h600",
      content:
        "피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡 피닐리아 귀여웡",
      editor_uid: "user3",
    },
    {
      brand_id: "B5348D",
      brand_name: "Monkey Bet DAO",
      img_url:
        "https://lh3.googleusercontent.com/ao9PJufgNCy_uV6E2_LDRyp1SC2oHNTxFKh3XaoA5ugcy0Rwd5yiDr0lcNjyCPZSfJcS6cYeq8MGU5c344579eM4dcdF2Askc1Ps=h600",
      content:
        "Decentralized gaming x NFT protocol. Created by Invariant Labs.",
      editor_uid: "user4",
    },
  ]);
  await Nft.bulkCreate([
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Party Penguin #1749",
      content: "펭귄1",
      img_url:
        "https://lh3.googleusercontent.com/wV9bwj-hpmjU50iKriaJ6Wo4etNITnG3zjC7sBNCIqRSt8vRMOYRijCZMVgtHcbs_OyT75zzcfORtqeT6GOF7K_aYtYKEYoeStMR=w345",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0065 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin1",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Party Penguin #3749",
      content: "펭귄2",
      img_url:
        "https://lh3.googleusercontent.com/HvzqKFsQnEe0Rm0v2uXqebAg-HCjpuSlmwb6RTQwtAO2jQXtMsWgQxiDp7iohGsDn7sxe20AztPxlsj8pXvHzxP0x6T27HK_6lIf=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.007 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin2",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Party Penguin #3742",
      content: "펭귄3",
      img_url:
        "https://lh3.googleusercontent.com/97jnzHZ-OWWU-cNB1Bl3HVXs2XnueV-Gp1_F0ga02PzE2aZpKk9IcWNo_LDvJ91huDWs9tAJv4WLlmdrOr9ERxtJ_NyuKHZKEAx6y9E=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.007 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin3",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Party Penguin #3738",
      content: "펭귄4",
      img_url:
        "https://lh3.googleusercontent.com/fyqIkdSLWKUHTVzxJ4bzv-aaL0Ghhde09l-tiYBBN2MSymiGOKW-PbfPDUVMcFqlDs-XWdnHQW-yq_SRjgAqfQ_hveZXYNp-aHxMEw=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.007 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin4",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Party Penguin #3755",
      content: "펭귄5",
      img_url:
        "https://lh3.googleusercontent.com/fLQmX7gGk_KZv3S-p7GOPWC1STJgSna3vDlgyo-psg1PUI2nVbvBcgAoL9no8VIeXOdjIE2jjpUknz0Sa0HVLSOOOcR09Y_yV-75b2s=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.007 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin5",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Party Penguin #123",
      content: "펭귄6",
      img_url:
        "https://lh3.googleusercontent.com/dIA2QjP9H4jyEsuywRKCRpLRILzLvqJnTISisUC0UlbiJmzBTWiBlXnKMS6cxmk-8asP8Cy_IenbW3tRUgvXUR32fCQpaXzeli-FvQ=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0071 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin6",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Party Penguin #1813",
      content: "펭귄7",
      img_url:
        "https://lh3.googleusercontent.com/2L3j3jds_43XO_Dic01ynoYDcuHeUzuQAPXdj6yMUrDao_lMNp7t3OsXOhH7O0ymy1_gbHRC1Xm6cj6nz3pQQxv6yd0KaTJy_75_=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0071 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin7",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Party Penguin #3739",
      content: "펭귄8",
      img_url:
        "https://lh3.googleusercontent.com/NwW0yCeUqy_l2jurERV-sBN7wVsAXU25Wltx7zljjqPcslaB2wFEFmsAEykMe_WLy7-HgzM0YiCYk5qDSlGgHxNetcIMJKdwKOsgkw=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0085 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin8",
      brand_name: "Party Penguins",
      brand_id: "PartyPenguinsContract",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Monkey #8315",
      content: "원숭이1",
      img_url:
        "https://lh3.googleusercontent.com/cqGBwQ1UgZpb0t8DqC18XUCvpLFdM3MhEu9PUoTyYjmO6rsFvts6vVWNUNQY_S9O0gU21lCasl1R1UiDtucYWc7k51VSfbGfkZLxpA=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.0099 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin1",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Monkey #9101",
      content: "원숭이2",
      img_url:
        "https://lh3.googleusercontent.com/4GxEAKxjZ6CacIdJiBAy-qxmjv4E-VJA1AYYKZo-VktNk_dsY_1HqJThLpP4dLG_Tw135xmhMUtErpvq7mbL4RaQuu_2Uv7hibNXWA=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.011 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin2",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Monkey #5731",
      content: "원숭이3",
      img_url:
        "https://lh3.googleusercontent.com/1GIFAyQNFgv897ZDCKOR6ilFLURudiwerjCz3W9FVDgu15DQ47GpuvbJwQzmlNbsO934eESGWXjkdhtf-LIi8eI7AUR6I0IzPOoWeg=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.012 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin3",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Monkey #1197",
      content: "원숭이4",
      img_url:
        "https://lh3.googleusercontent.com/gshb_oaKmDhwLYaVdvEO-qxL0tJJ6b-jH1NF9agESDBNMrXh2pS03A9x8VF5NEkHtPD6uZNJ7Sh0qUH-aF4-fE8s59sdbRNayhWVHQ=w600",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.015 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin4",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Monkey #4171",
      content: "원숭이5",
      img_url:
        "https://lh3.googleusercontent.com/YpQuTaHhkuamVYYJwZWbSl0G-AklublIP-oFTVGuUfWSdZ6WWO2bacZx4W0-Cf3YNZMv1ldtkCSQJA2oJSQH9VsW0qt6R27JF1SR=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.018 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin5",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Monkey #3043",
      content: "원숭이6",
      img_url:
        "https://lh3.googleusercontent.com/yAl7jMxGVd9JtUeNMUvL3XxTvOkCBDZ0hsZFQVHgw1VjYRXmFxhuZTG0W3s4HIwIGpY1WeUBw64QsqyEHSNnaIychG-uaGKPEHZx4DQ=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.02 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin6",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Monkey #3932",
      content: "원숭이7",
      img_url:
        "https://lh3.googleusercontent.com/s4O1Oc1ro8hZ42nNLLvdH3KFUvb50IVUu9a3fYa-TH3ZOPzgsBHyyc2NPd2zcoRWlbyI_Dd8kCbTdHBH1p2zEgDsqh9dVKHtM42rQw=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.02 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin7",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "Monkey #4564",
      content: "원숭이8",
      img_url:
        "https://lh3.googleusercontent.com/O_PwQ05f6fuezqGSHXCvfJAhf56V1tLeDLpdJdx5bcaRxxfsfLP26YrmJ1PW-V9lxl7-GOcbYowMVHgz5XRiEao-RqaggCPXgqjs=w600 ",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin1", price: 0.025 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin8",
      brand_name: "Monkey Bet DAO",
      brand_id: "B5348D",
    },
    {
      nft_id: createNftId(),
      view: JSON.stringify([{ name: "" }]),
      like: JSON.stringify([{ name: "" }]),
      title: "NFT제목1",
      content: "NFT내용1",
      img_url:
        "https://trboard.game.onstove.com/Data/TR/20170718/20/636360060838331309.jpg",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin", price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin",
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",
    },
    {
      nft_id: nfts[1],
      title: "NFT제목2",
      content: "NFT내용2",
      img_url:
        "https://s3.orbi.kr/data/file/united/995556963_B6vl079m_8F223DF0-FEDE-434A-9439-8DF090FC8A66-5388-000005FED6FDB041_file.gif",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin", price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin",
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",
    },
    {
      nft_id: nfts[2],
      title: "NFT제목3",
      content: "NFT내용3",
      img_url: "https://cdn.cashfeed.co.kr/attachments/d070572048.jpg",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin", price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin",
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",
    },
    {
      nft_id: nfts[3],
      title: "NFT제목4",
      content: "NFT내용4",
      img_url:
        "https://s3.orbi.kr/data/file/united/3076648493_6OwZD2W7_3716959146_nGmh9FkA_E46C698A-F9F6-4A54-8F9D-A2F13A450DA6-490-000000468E3E8B5D_tmp.png",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "admin", price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "admin",
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",

      nft_id: userNfts[0],
      title: "NFT제목1",
      content: "NFT내용1",
      img_url:
        "https://s3.orbi.kr/data/file/united/3076648493_6OwZD2W7_3716959146_nGmh9FkA_E46C698A-F9F6-4A54-8F9D-A2F13A450DA6-490-000000468E3E8B5D_tmp.png",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "user1", price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "user1",
      brand_name: "펭귄조아",
      brand_id: "펭귄조아",
    },
    {
      nft_id: userNfts[1],
      title: "NFT제목2",
      content: "NFT내용2",
      img_url:
        "https://s3.orbi.kr/data/file/united/3076648493_6OwZD2W7_3716959146_nGmh9FkA_E46C698A-F9F6-4A54-8F9D-A2F13A450DA6-490-000000468E3E8B5D_tmp.png",
      history: JSON.stringify([
        { prev_owner: createUid(), curr_owner: "user1", price: 999999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 9999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 999999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 99999 },
        { prev_owner: createUid(), curr_owner: createUid(), price: 10000 },
      ]),
      onwer: "user1",
      brand_name: "피닐리아",
      brand_id: "피닐리아",
    },
  ]);
  await Room.bulkCreate([
    {
      room_id: rooms[0],
      event: JSON.stringify([
        {
          uid: "user1",
          name: "user1",
          img_url: "/static/image/turn.gif",
          msg: "방1 테스트1",
        },
      ]), //[{uid, msg, not_read}]
      member: JSON.stringify([
        { uid: "admin", name: "admin", img_url: "/static/image/cat.png" },
        { uid: "user1", name: "user1", img_url: "/static/image/turn.gif" },
        { uid: "user2", name: "user2", img_url: "/static/image/brand.gif" },
        { uid: "user3", name: "user3", img_url: "/static/image/turn.gif" },
      ]),
    },
    {
      room_id: rooms[1],
      event: JSON.stringify([
        {
          uid: "",
          name: "",
          img_url: "",
          msg: "",
        },
      ]),
      member: JSON.stringify([
        { uid: "admin", name: "admin", img_url: "/static/image/cat.png" },
        { uid: "user2", name: "user2", img_url: "/static/image/turn.gif" },
      ]),
    },
    {
      room_id: rooms[2],
      event: JSON.stringify([
        {
          uid: "",
          name: "",
          img_url: "",
          msg: "",
        },
      ]),
      member: JSON.stringify([
        { uid: "admin", name: "admin", img_url: "/static/image/cat.png" },
        { uid: "user3", name: "user3", img_url: "/static/image/cry.gif" },
      ]),
    },
    {
      room_id: rooms[3],
      event: JSON.stringify([
        {
          uid: "",
          name: "",
          img_url: "",
          msg: "",
        },
      ]),
      member: JSON.stringify([
        { uid: "admin", name: "admin", img_url: "/static/image/cat.png" },
        { uid: "user1", name: "user1", img_url: "/static/image/brand.gif" },
      ]),
    },
  ]);
  await Chat.bulkCreate([
    {
      room_id: rooms[0],
      sender: "admin",
      name: "admin",
      img_url: "/static/image/cat.png",
      msg: "방1 테스트1",
      not_read: JSON.stringify(["user1", "user2", "user3"]),
    },
    {
      room_id: rooms[0],
      sender: "user1",
      name: "user1",
      img_url: "/static/image/turn.gif",
      msg: "방1 테스트2",
      not_read: JSON.stringify(["user1", "user2", "user3"]),
    },
    {
      room_id: rooms[0],
      sender: "user2",
      name: "user2",
      img_url: "/static/image/brand.gif",
      msg: "방1 테스트3",
      not_read: JSON.stringify(["user1", "user2"]),
    },
    {
      room_id: rooms[0],
      sender: "user3",
      name: "user3",
      msg: "방1 테스트4",
      img_url: "/static/image/turn.gif",
      not_read: JSON.stringify(["user1"]),
    },
    {
      room_id: rooms[0],
      sender: "user3",
      name: "user3",
      msg: "방1 테스트4",
      img_url: "/static/image/turn.gif",
      not_read: JSON.stringify(["user1"]),
    },
    {
      room_id: rooms[1],
      sender: "admin",
      name: "admin",
      img_url: "/static/image/cat.png",
      msg: "방1 테스트2",
      not_read: JSON.stringify(["user2"]),
    },
    {
      room_id: rooms[1],
      sender: "user2",
      name: "user2",
      img_url: "/static/image/brand.gif",
      msg: "방1 테스트3",
      not_read: JSON.stringify(["admin"]),
    },
    {
      room_id: rooms[2],
      sender: "admin",
      name: "admin",
      img_url: "/static/image/cat.png",
      msg: "방1 테스트3",
      not_read: JSON.stringify(["user3"]),
    },
    {
      room_id: rooms[2],
      sender: "user1",
      name: "user1",
      img_url: "/static/image/turn.gif",
      msg: "방1 테스트4",
      not_read: JSON.stringify(["admin"]),
    },
  ]);
}

module.exports = { initDb };
