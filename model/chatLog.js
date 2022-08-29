const Sequelize = require("sequelize");

class ChatLog extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          unique: true,
        },
      },
      {                       
        sequelize,
        underscored: false,
        timestamps: true,
        modelName: "ChatLog",
        tableName: "ChatLogs",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.ChatLog.belongsTo(db.User, {
      foreignKey: "user_uid",
      targetKey: "uid",
    });
    db.ChatLog.belongsTo(db.ChatMember, {
      foreignKey: "roomtype",
      targetKey: "roomtype",
    });
  }
}

module.exports = ChatLog;
