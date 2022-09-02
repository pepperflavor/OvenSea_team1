const Sequelize = require("sequelize");

class Editor extends Sequelize.Model {
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
        editorName: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        sequelize,
        underscored: false,
        timestamps: true,
        modelName: "Editor",
        tableName: "editors",
        charset: "utf8mb4",
        collate: "utf8mb4_general_ci",
      }
    );
  }
  // user 테이블에서 uid, email 을 받아다 fk로 사용
  static associate(db) {
    db.Editor.belongsTo(db.User, {
      foreignKey: "user_uid",
      targetKey: "uid",
    });
    db.Editor.belongsTo(db.User, {
      foreignKey: "email",
      targetKey: "email",
    });
  }
}

module.exports = Editor;
