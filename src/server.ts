import express from 'express';
import  dotenv from 'dotenv';
import { connectDatabase } from './db';
import  routes  from './routes/routes';

// Carica le variabili d'ambiente
dotenv.config();

// Inizializza l'app Express
const app = express();

// Configura il parsing del corpo delle richieste in formato JSON
app.use(express.json());

// Configura le rotte dell'app
app.use('/api', routes);

// Avvia il server
const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
  
  // Connettiti al database
  try {
    await connectDatabase();
    console.log('Connected to database');
  } catch (error) {
    console.error('Failed to connect to database:', error);
  }
});
