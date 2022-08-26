const Sequelize = require("sequelize");

class ChatMember extends Sequelize.Model{

    static init(sequelize){
        return super.init(
          {
            id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
              unique: true,
            },
            roomtype: {
              type: Sequelize.TINYINT,
              unique: true,
            },
          },
          {
            sequelize,
            underscored: false,
            timestamps: true,
            modelName: "ChatMember",
            tableName: "chatMembers",
            charset: "utf8mb4",
            collate: "utf8mb4_general_ci",
          }
        );
    }
    // user 테이블에서 uid를 받아다 fk로 사용
    static associate(db){
      db.ChatMember.belongsTo(db.User, {foreignKey : "user_uid", targetKey : "uid"});
    }
}

module.exports = ChatMember;