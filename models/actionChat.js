const Sequelize = require("sequelize");

class ActionChat extends Sequelize.Model {
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
        modelName: "ActionChat",
        tableName: "actionChats",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  static associate(db) {
    db.ActionChat.belongsTo(db.User, {
      foreignKey: "user_uid",
      targetKey: "uid",
    });
    db.ActionChat.belongsTo(db.ChatMember, {
      foreignKey: "roomtype",
      targetKey: "roomtype",
    });
  }
}                                                                                                                          
module.exports = ActionChat;