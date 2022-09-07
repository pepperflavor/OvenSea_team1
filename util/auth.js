class Auth {
  constructor() {
    this.myAuth = "";
  }
  getAuth = async () => {
    return new Promise((resolve, reject) => {
      sendAxios({
        url: "/getAuth",
        data: {},
      }).then(({ data }) => {
        this.myAuth = data;
        resolve(this);
      });
    });
  };

  getUser = () => this.myAuth;
  getUid = () => this.myAuth.uid;
  getImgUrl = () => this.myAuth.img_url;
  getbalance = () => this.myAuth.balance;
  getName = () => this.myAuth.name;
  getGallery = () => JSON.parse(this.myAuth.gallery);
  getGrade = () => this.myAuth.grade;
}