"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const db_1 = require("../db");
class Move extends sequelize_1.Model {
    static associate(models) {
        Move.belongsTo(models.Game, { foreignKey: 'gameId', as: 'game' });
        Move.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
    }
}
Move.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    gameId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    position: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize: db_1.sequelize,
    tableName: 'moves',
});
exports.default = Move;
//# sourceMappingURL=move.js.map