import  express from 'express';
import  dotenv from 'dotenv';
import  cors from 'cors';
import routes from './routes/routes';

// Carica le variabili di ambiente da .env
dotenv.config();

// Inizializza l'app Express
const app = express();

// Middleware per il parsing del corpo delle richieste
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware per l'abilitazione delle richieste da domini diversi
app.use(cors());

// Collega le rotte all'app Express
app.use(routes);

// Gestione degli errori
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Avvia il server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
