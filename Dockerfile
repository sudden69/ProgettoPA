# Usa un'immagine di base contenente Node.js per la build
FROM node:latest as builder

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia il file di dipendenze
COPY package*.json ./

# Installa tutte le dipendenze
RUN npm install \
  cors \
  dotenv \
  sequelize \
  express \
  bcrypt \
  jsonwebtoken \
  tic-tac-toe-ai-engine \
  pdfkit

# Copia tutto il codice
COPY . .

# Compila il codice TypeScript
RUN npx tsc

# Usa un'immagine di base più leggera per l'esecuzione
FROM node:alpine

# Installa il client PostgreSQL
RUN apk add --no-cache postgresql-client

# Imposta la directory di lavoro all'interno del container
WORKDIR /app

# Copia solo i file necessari dalla build precedente
COPY --from=builder /app/dist ./dist

# Installa solo le dipendenze di produzione
COPY --from=builder /app/package.json ./
RUN npm install --production

# Esponi la porta su cui l'applicazione ascolta (assicurati che corrisponda alla porta utilizzata in server.ts)
EXPOSE 3000

# Avvia l'applicazione
CMD ["node", "dist/server.js"]
