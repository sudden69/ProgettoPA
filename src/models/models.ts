import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize, Sequelize } from '../db';

// Definizione delle interfacce per gli attributi dei modelli
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  credit: number;
  isAdmin: boolean;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}
export { UserCreationAttributes };
interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}
export { UserInstance };

interface GameAttributes {
  id: number;
  userId: number;
  opponentId: number; 
  status: string;
  winner?: string; // winner ora è di tipo stringa
  boardState: string[];
}

interface GameCreationAttributes extends Optional<GameAttributes, 'id'> {}
export { GameCreationAttributes };
interface GameInstance
  extends Model<GameAttributes, GameCreationAttributes>,
    GameAttributes {}
export { GameInstance };

interface MoveAttributes {
  id: number;
  gameId: number;
  userId: number;
  position: number;
}

interface MoveCreationAttributes extends Optional<MoveAttributes, 'id'> {}

interface MoveInstance
  extends Model<MoveAttributes, MoveCreationAttributes>,
    MoveAttributes {}
export { MoveInstance };

// Factory per la creazione dei modelli
const userModelFactory = (sequelize: Sequelize) => {
  return sequelize.define<UserInstance>('User', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    credit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });
};

const gameModelFactory = (sequelize: Sequelize) => {
  return sequelize.define<GameInstance>('Game', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    opponentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    winner: {
      type: DataTypes.STRING, // winner ora è di tipo stringa
    },
    boardState: {
      type: DataTypes.ARRAY(DataTypes.STRING), // boardState è un array di stringhe
      allowNull: false,
    },
  });
};

const moveModelFactory = (sequelize: Sequelize) => {
  return sequelize.define<MoveInstance>('Move', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });
};

export { userModelFactory, gameModelFactory, moveModelFactory };
