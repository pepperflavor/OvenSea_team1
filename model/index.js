// index.js가 model 안에 model js파일들을 모아서 사용하는 곳
const Sequelize = require("sequelize");

// config.js 에서 module.exports = config 내보내기를 하고
// require("../config/config") 가져오면 내보낸 객체가 가져와진다.
const { config } = require("../config/config");
const User = require("./users");
const Nft = require("./nfts");
const Rank = require("./ranks");
const Report = require("./reports");

// console.log(config);

const { database, username, password } = config.dev;

const sequelize = new Sequelize(database, username, password, config.dev);

// 내보내기 위한 빈객체
const db = {};
// 그 빈객체에 sequealize 키값으로 시퀄라이즈 객체만든것을넣어준다.
// User도 내보내서 사용할 예정이라 키값
db.sequelize = sequelize;
db.User = User;
db.Nft = Nft;
db.Rank = Rank;
db.Report = Report;

// 이 구문이 없으면 테이블이 생성되지 않는다.
User.init(sequelize);
Nft.init(sequelize);
Rank.init(sequelize);
Report.init(sequelize);

// 관계형을 맺어주는 함수 사용
User.associate(db);
Nft.associate(db);
Rank.associate(db);
Report.associate(db);

module.exports = db;
