class Auth {
  constructor() {
    this.myUid = "";
  }
  getAuth = async () => {
    return new Promise((resolve, reject) => {
      sendAxios({
        url: "/getAuth",
        data: {},
      }).then(({ data }) => {
        this.myUid = data;
        resolve(this);
      });
    });
  };

  getUid = () => this.myUid.uid;
  getImgUrl = () => this.myUid.img_url;
  getbalance = () => this.myUid.balance;
  getName = () => this.myUid.name;
  getGallery = () => JSON.parse(this.myUid.gallery);
  getGrade = () => this.myUid.grade;
}

// const myAuth = new Auth();
// myAuth.getAuth().then(() => {
//   console.log(
//     myAuth.getUid(),
//     myAuth.getImgUrl(),
//     myAuth.getbalance(),
//     myAuth.getName(),
//     myAuth.getGallery(),
//     myAuth.getGrade()
//   );
// });
