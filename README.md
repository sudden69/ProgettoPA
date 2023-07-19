# Tic Tac Toe - Backend


## Descrizione

Questo progetto è un'applicazione backend che consente agli utenti di giocare a Tic Tac Toe. Gli utenti possono interagire con l'applicazione tramite endpoint API RESTful e giocare l'uno contro l'altro o contro un motore di intelligenza artificiale utilizzando la libreria tic-tac-toe-ai-engine. L'applicazione è costruita utilizzando Express e Sequelize e Postgres.

## Funzionalità

- Autenticazione Utenti: Gli utenti possono autenticarsi utilizzando token JWT.
- Creazione Partita: Gli utenti possono creare una nuova partita specificando il tipo di gioco (utente vs. utente o utente vs. IA) e l'e-mail dell'avversario (nel caso di una partita utente vs. utente).
- Sistema di Crediti per le Partite: Viene addebitato un certo numero di token per la creazione di ogni partita e per ogni mossa effettuata durante il gioco. I token degli utenti sono gestiti e memorizzati nel database.
- Mosse nella Partita: Gli utenti possono effettuare mosse in una partita specifica e il sistema verifica se la mossa è valida o meno.
- Abbandono della Partita: Gli utenti possono abbandonare una partita in corso.
- Stato della Partita: Gli utenti possono verificare lo stato di una partita specifica, inclusi i dettagli di chi è il turno e se la partita è terminata o meno.
- Cronologia delle Mosse: Gli utenti possono richiedere la cronologia delle mosse di una partita, selezionando il formato di output (PDF o JSON) e specificando un periodo di tempo (data di inizio, data di fine).
- Classifica: È disponibile una rotta pubblica per ottenere la classifica, che mostra il numero di partite vinte, partite vinte per abbandono, partite perse e partite perse per abbandono. La classifica può essere ordinata in ordine crescente o decrescente e mostra le statistiche per le partite contro utenti reali e IA. Il punteggio è calcolato in base al numero di partite vinte, considerando anche le partite vinte per abbandono.

## Installazione

Per eseguire questa applicazione, seguire i seguenti passaggi:

1. Clonare questo repository sul proprio computer locale.
2. Installare le dipendenze richieste utilizzando npm:

```bash
npm install

```

3. Configurare Postgres e impostare la connessione al database nel file `.env`.Attualmente la password è admin, la porta è 5432 e l'host è db, che era il nome del database del container durante la fase di test.

4. Avviare l'applicazione:

Sarà sufficiente utilizzare il comando docker-compose up

5. Il server dovrebbe essere in esecuzione su http://localhost:3000.

## Endpoint API

- **POST /api/register**: Registra un nuovo utente.
- **POST /api/login**: Login e autenticazione dell'utente (restituisce il token JWT).
- **POST /api/create-game**: Crea una nuova partita, specificando il tipo e l'e-mail dell'avversario.
- **POST /api/make-move/:gameId**: Effettua una mossa in una partita specifica.
- **POST /api/abandon-game/:gameId**: Abbandona una partita in corso.
- **GET /api/game-status/:gameId**: Ottieni lo stato di una partita specifica.
- **GET /api/move-history/:gameId**: Ottieni la cronologia delle mosse di una partita specifica.
- **GET /api/leaderboard**: Ottieni la classifica.

Le api postman utilizzate per i test si possono ottenere con la seguente chiave: https://api.postman.com/collections/26036241-0e3595dc-05ff-499a-9322-7201b38653f0?access_key=PMAT-01H5R2RAZH4SWXBBS7XBF4VSTV
## Dati di Test

L'applicazione fornisce dati di test per inizializzare il sistema. È possibile eseguire il seguente comando per popolare il database con dati di esempio:

```bash
node dist\seed.ts
```
## Design Pattern

Singleton:
L'utilizzo delle variabili app, sequelize, e dotenv.config() segue un approccio singleton, garantendo che ci sia una sola istanza di queste variabili nell'applicazione. In particolare ogni model fa affidamento sulla stessa connessione al database.

Il progetto ha una struttura organizzata secondo il pattern MVC (Model-View-Controller) con l'uso di middleware. Ecco come le diverse componenti del progetto si collegano al pattern MVC:

Model:

Nella directory models viene sviluppato il modello di Game, Move, e User in un singolo file models.ts. Questo utilizza il pattern factory e lascia che l'implemantazione finale avvenga in db.ts

User: rappresenta gli attributi di un utente e fornisce metodi per accedere a questi dati, tra cui la proprietà isAdmin che determina se l'user è in grado di gestire e ricaricare il proprio credito e quello degli altri utenti, ma anche la creazione, l'aggiornamento, la ricerca di utenti esistenti.

Game: rappresenta una singola partita nel database e contiene lo status sia come messaggio di testo sia come array di simboli 'X' e 'O'. Riporta i due avversari o l'utente e l'AI, il vincitore della partita, se la partita è stata abbandonata. 

Move: rappresenta una singola mossa effettuata da un utente o da un AI. Esistono dei controlli di validità che verranno gestiti dai middleware.  

Controller:
userController: implementa le richieste delle rotte relative agli utenti, come l'aggiornamento dell'email e del nome utente oppure la stampa di un json con gli attributi dell'utente dato un JWT di autenticazione.

gameController: sviluppa il codice relativo alle partite, come la creazione di una nuova partita, la classifica(rotta pubblica), la gestione delle mosse dell'intelligenza artificiale, la gestione e l'aggiornamento delle mosse(si è preferito non sviluppare un controller apposito),  la possibilità di abbandono e la logica di vittoria. Sono presenti anche diverse funzioni di utilità, come la funzione di generazione pdf per lo storico delle mosse.

authController: qui avviene l'autenticazione attraverso i token jwt, in particolare nel processo di registrazione di nuovi utenti 

userAdminController: controller apposito dell'admin per la gestione del credito degli utenti.

Middleware:

authenticateToken: sono presenti due middleware separati per la gestione degli errori dei token di autenticazione di un utente admin o user semplice, questo per una gestione più semplice in fase di debug

isAdmin: verifica il flag isAdmin e se risulta false nega l'accesso alla funzione di ricarica dei token

errorHandler: gestisce i casi base di Internal Server Error 500

validateRequest: valida le richieste, come ad esempio l'uso di mosse non valide all'interno del gioco.

Il progetto segue quindi una struttura MVC ben precisi, dove le componenti del modello gestiscono l'accesso ai dati, i controller si occupano dell'elaborazione delle richieste degli utenti e delle logiche alla loro base, e i middleware eseguono la validazione e le verifiche necessarie prima di passare alle componenti di modello o controller, rendendo il codice più manutenibile.

## Diagrammi UML



## Come Giocare

1. Registrarsi o effettuare l'accesso come utente per ottenere il token JWT.
2. Creare una nuova partita specificando il tipo di gioco e l'e-mail dell'avversario (nel caso di una partita utente vs. utente).
3. Utilizzare il token JWT per effettuare le mosse nella partita.
4. Verificare lo stato della partita e la cronologia delle mosse, se necessario.
5. Utilizzare la rotta "abbandona-partita" per abbandonare una partita, se lo si desidera.

## Autore

Creato da Davide Tomo
