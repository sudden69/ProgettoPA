# Tic Tac Toe - Backend


## Descrizione

Questo progetto è un'applicazione backend che consente agli utenti di giocare a Tic Tac Toe. Gli utenti possono interagire con l'applicazione tramite endpoint API RESTful e giocare l'uno contro l'altro o contro un motore di intelligenza artificiale utilizzando la libreria tic-tac-toe-ai-engine. L'applicazione è costruita utilizzando Express, Sequelize e Postgres.

## Funzionalità

- Autenticazione Utenti: Gli utenti possono autenticarsi utilizzando token JWT.
- Creazione Partita: Gli utenti possono creare una nuova partita specificando il tipo di gioco (utente vs. utente o utente vs. IA) e l'e-mail dell'avversario (nel caso di una partita utente vs. utente).
- Sistema di Crediti per le Partite: Viene addebitato un certo numero di token per la creazione di ogni partita (0.5 se PVP, 0.75 contro AI) e per ogni mossa effettuata (0.015) durante il gioco. I token degli utenti sono gestiti e memorizzati nel database.
- Mosse nella Partita: Gli utenti possono effettuare mosse in una partita specifica e il sistema verifica se la mossa è valida o meno.
- Abbandono della Partita: Gli utenti possono abbandonare una partita in corso.
- Stato della Partita: Gli utenti possono verificare lo stato di una partita specifica, inclusi i dettagli di chi è il turno e se la partita è terminata o meno.
- Cronologia delle Mosse: Gli utenti possono richiedere la cronologia delle mosse di una partita, selezionando il formato di output (PDF o JSON) e specificando un periodo di tempo (data di inizio, data di fine).
- Classifica: È disponibile una rotta pubblica per ottenere la classifica, che mostra il numero di partite vinte, partite vinte per abbandono, partite perse e partite perse per abbandono. La classifica può essere ordinata in ordine crescente o decrescente e mostra le statistiche per le partite contro utenti reali e IA. Il primo classificato risulta essere chi totalizza il maggior numero di partite vinte, considerando anche le partite vinte per abbandono.

## Installazione

Per eseguire questa applicazione, seguire i seguenti passaggi:

1. Clonare questo repository sul proprio computer locale.
2. Installare le dipendenze richieste utilizzando npm:

```bash
npm install

```

3. Configurare Postgres e impostare la connessione al database nel file `.env`.Attualmente la password è admin, la porta è 5432 e l'host è db, che era il nome del database del container durante la fase di test.

**4. Avviare l'applicazione:**

Sarà sufficiente utilizzare il comando docker-compose up

Il server dovrebbe essere in esecuzione su http://localhost:3000, mentre il db su http://localhost:5432, ma internamente al container.

Nel caso si voglia optare per l'avvio in locale, con possibilità di modifica del codice sorgente, dopo aver installato ogni dipendenza (sequelize, pdfkit, dotenv etc) con npm install, si proceda alla compilazione con il comando tsc e infine all'avvio con node dist/server.js.

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

Storico mosse in pdf con la libreria pdfkit di una partita utente contro AI:
![image](https://github.com/sudden69/ProgettoPA/assets/62214136/d0dfd884-0ecd-4bdc-ae5a-14fbd1850bd8)

Un esempio di come appare boardState sul database pg:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/d16534bb-e92c-4945-bb7e-b4ee48a14370)

Gli indici vanno da 0 a 9, in modulo tre rappresentano la colonna mentre divisi per 3 rappresentano la riga.

Esempio di registrazione utente che restituisce un token JWT:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/1c75e471-0fc4-453a-ab99-61c11794d83c)

Esempio di richiesta get autenticata:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/a627719a-a86b-415a-b10a-03907c28211a)

Esempio di login:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/e4ca4651-5ac9-48ee-8148-e5d96eb6aa61)

Esempio di recharge del credito (il JWT nell'header appartiene ad un admin):

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/4bdccc68-433b-445d-9010-d2d494a84f85)

Esempio di gestione dell'errore quando l'utente è già impegnato in un altra partita:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/c8d95767-61a6-4aec-9213-ecaa01059051)

Esempio di creazione sfida ad AI:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/4cc626c2-2f76-4465-a4da-9eea246999b8)

Esempio di errore quando la partita è terminata ma si tenta ancora di muovere:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/9d99727b-f0cf-45e7-950a-a431741a1201)

Esempio di controllo sui turni:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/c0d0d460-35e1-4db6-99d8-194ca3cb49d9)

Esempio di errore perché non si possiede uno dei due JWT per accedere ad una specifica partita PVP:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/cfd41a98-8111-4684-ac4d-375c5270f819)

Esempio di mossa riuscita:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/2b3f29c8-498d-411e-beb6-873cad8287c5)

Esempio di abbandono:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/a146ae60-b516-4c75-a362-4438e49c4a02)

Esempio di controllo status:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/d7b2e7ab-420e-45ee-8f34-a8f23168900d)

Esempio di classifica dal giocatore con più vittorie a scendere:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/76df7183-0b0a-4520-8f73-3ad23e593d86)

Esempio di credito insufficiente:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/f0ded760-365d-4d38-8a9f-bcfcf5b16048)


## Dati di Test

L'applicazione fornisce dati di test per inizializzare il sistema. È possibile eseguire il seguente comando per popolare il database con dati di esempio:

```bash
node dist\seed.js
```
## Design Pattern

**Dependency Injection**: il pattern Dependency Injection è stato applicato per iniettare le dipendenze delle classi. Questo rende il codice più modulare e facilita la gestione delle dipendenze

**Singleton:**
L'utilizzo delle variabili app, sequelize, e dotenv.config() segue un approccio singleton, garantendo che ci sia una sola istanza di queste variabili nell'applicazione. In particolare ogni model fa affidamento sulla stessa connessione al database.

Il progetto ha una struttura organizzata secondo il pattern MVC (Model-View-Controller) con l'uso di middleware. Ecco come le diverse componenti del progetto si collegano al pattern MVC:

**Model:**

Nella directory models viene sviluppato il modello di Game, Move, e User in un singolo file models.ts. Questo utilizza il pattern **factory** e lascia che l'implemantazione finale avvenga in db.ts

User: rappresenta gli attributi di un utente e fornisce metodi per accedere a questi dati, tra cui la proprietà isAdmin che determina se l'user è in grado di gestire e ricaricare il proprio credito e quello degli altri utenti, ma anche la creazione, l'aggiornamento, la ricerca di utenti esistenti.

Game: rappresenta una singola partita nel database e contiene lo status sia come messaggio di testo sia come array di simboli 'X' e 'O'. Riporta i due avversari o l'utente e l'AI, il vincitore della partita, se la partita è stata abbandonata. 

Move: rappresenta una singola mossa effettuata da un utente o da un AI. Esistono dei controlli di validità che verranno gestiti dai middleware.  

**Controller:**

userController: implementa le richieste delle rotte relative agli utenti, come l'aggiornamento dell'email e del nome utente oppure la stampa di un json con gli attributi dell'utente dato un JWT di autenticazione.

gameController: sviluppa il codice relativo alle partite, come la creazione di una nuova partita, la classifica(rotta pubblica), la gestione delle mosse dell'intelligenza artificiale, la gestione e l'aggiornamento delle mosse(si è preferito non sviluppare un controller apposito),  la possibilità di abbandono e la logica di vittoria. Sono presenti anche diverse funzioni di utilità, come la funzione di generazione pdf per lo storico delle mosse.

authController: qui avviene l'autenticazione attraverso i token jwt, in particolare nel processo di registrazione di nuovi utenti 

userAdminController: controller apposito dell'admin per la gestione del credito degli utenti.

**Middleware:**

authenticateToken: sono presenti due middleware separati per la gestione degli errori dei token di autenticazione di un utente admin o user semplice, questo per una gestione più semplice in fase di debug

isAdmin: verifica il flag isAdmin e se risulta false nega l'accesso alla funzione di ricarica dei token

errorHandler: gestisce i casi base di Internal Server Error 500

validateRequest: valida le richieste, come ad esempio l'uso di mosse non valide all'interno del gioco.

Il progetto segue quindi una struttura MVC ben precisi, dove le componenti del modello gestiscono l'accesso ai dati, i controller si occupano dell'elaborazione delle richieste degli utenti e delle logiche alla loro base, e i middleware eseguono la validazione e le verifiche necessarie prima di passare alle componenti di modello o controller, rendendo il codice più manutenibile.

## Diagrammi UML

Gestione Utenti:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/d44563eb-62e1-4495-936d-9522f113fe78)

Gestione Partite:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/006acfd0-2308-46ca-9009-3755c0087fee)

Diagramma Classi: (Concettuale, nell'implementazione non è stata necessaria una classe AI e non si sono usate le enum, la gestione è stata diversa ma con la stessa logica)

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/e8e59502-d954-4ec4-adb6-b9ef53daacee)

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/b88d3c80-c7c7-49c9-b0fe-0fb409c15b7e)
(Approssimazione che non tiene conto degli altri livelli)

Diagramma attività (Partita):

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/4615a91b-df53-4e64-843f-45c516b2b559)

Diagramma controller:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/9c5a39f3-8eb2-48cd-9d69-46cb61d013ed)

Diagramma middleware:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/90077a1c-5da4-4569-970a-ab03872d52e5)

Diagramma delle interazioni per lo storico mosse:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/7cf17233-3ccb-4644-8e62-914b04f1c56d)

Diagramma delle interazioni per la richiesta di status della partita:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/39fb7fb1-830a-4082-a275-e8c9355e7e4b)
Diagramma delle interazioni per una richiesta di abbandono:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/678d1d66-b1e2-4195-bc40-bc3ecbb7ea7b)

Diagramma delle interazioni per makeMove:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/830a56ca-0403-4b4e-ac8d-ea069656ad29)

Diagramma di struttura per l'autenticazione:

![image](https://github.com/sudden69/ProgettoPA/assets/62214136/33a25f03-aeb5-4314-a002-9e8b51633b8c)


## Come Giocare

1. Registrarsi o effettuare l'accesso come utente per ottenere il token JWT.
2. Creare una nuova partita specificando il tipo di gioco e l'e-mail dell'avversario (nel caso di una partita utente vs. utente).
3. Utilizzare il token JWT per effettuare le mosse nella partita.
4. Verificare lo stato della partita e la cronologia delle mosse, se necessario.
5. Utilizzare la rotta "abandon" per abbandonare una partita, se lo si desidera.

## Autore

Creato da Davide Tomo
