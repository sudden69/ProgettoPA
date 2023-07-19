import bcrypt from 'bcrypt';
import { User } from './db';

const seedData = [
  {
    username: 'admin1',
    email: 'admin1@example.com',
    password: 'adminpassword', // Non hashare la password qui
    credit: 100,
    isAdmin: true,
  },
  {
    username: 'user2',
    email: 'user2@example.com',
    password: 'user1password', // Non hashare la password qui
    credit: 50,
    isAdmin: false,
  },
  // Aggiungi altri dati di esempio se necessario
];

const seedDatabase = async () => {
  try {
    for (const data of seedData) {
      const hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    }

    await User.bulkCreate(seedData, {
      individualHooks: true,
    });

    console.log('Seed data inserted successfully.');
  } catch (error) {
    console.error('Error inserting seed data:', error);
  } finally {
    // Chiudi la connessione al database o fai altre operazioni necessarie
    process.exit();
  }
};

seedDatabase();
