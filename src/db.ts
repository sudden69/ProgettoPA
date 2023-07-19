import { Sequelize } from 'sequelize';
import { userModelFactory, gameModelFactory, moveModelFactory } from './models/models';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ,
});

// Definizione dei modelli
const User = userModelFactory(sequelize);
const Game = gameModelFactory(sequelize);
const Move = moveModelFactory(sequelize);

// Definizione delle associazioni tra modelli, se necessario
// Esempio: User.hasMany(Game);

// Connettiti al database e sincronizza i modelli
async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');

    // Sincronizza i modelli con il database
    await sequelize.sync();
    console.log('Database synchronized.');

    // Restituisci i modelli per essere utilizzati altrove
    return { User, Game, Move };
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

export { sequelize, Sequelize, connectDatabase, User, Game, Move };
