const Sequelize = require("sequelize");

class FreeChat extends Sequelize.Model {
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
        modelName: "FreeChat",
        tableName: "freeChats",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }

  static associate(db) {
    db.FreeChat.belongsTo(db.User, {
      foreignKey: "user_uid",
      targetKey: "uid",
    });
    db.FreeChat.belongsTo(db.ChatMember, {
      foreignKey: "roomtype",
      targetKey: "roomtype",
    });
  }
}

module.exports = FreeChat;