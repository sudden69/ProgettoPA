"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.moveModelFactory = exports.gameModelFactory = exports.userModelFactory = void 0;
const sequelize_1 = require("sequelize");
// Factory per la creazione dei modelli
const userModelFactory = (sequelize) => {
    return sequelize.define('User', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        username: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        credit: {
            type: sequelize_1.DataTypes.FLOAT,
            allowNull: false,
        },
        isAdmin: {
            type: sequelize_1.DataTypes.BOOLEAN,
            allowNull: false,
        },
    });
};
exports.userModelFactory = userModelFactory;
const gameModelFactory = (sequelize) => {
    return sequelize.define('Game', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
        },
        userId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        opponentId: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
        },
        status: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        winner: {
            type: sequelize_1.DataTypes.STRING, // winner ora è di tipo stringa
        },
        boardState: {
            type: sequelize_1.DataTypes.ARRAY(sequelize_1.DataTypes.STRING),
            allowNull: false,
        },
    });
};
exports.gameModelFactory = gameModelFactory;
const moveModelFactory = (sequelize) => {
    return sequelize.define('Move', {
        id: {
            type: sequelize_1.DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
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
    });
};
exports.moveModelFactory = moveModelFactory;
//# sourceMappingURL=models.js.map