import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Creăm o instanță a clientului
const client = new pg.Client({
  user: process.env.DB_USER,       
  host: process.env.DB_HOST,       
  database: process.env.DB_DATABASE, 
  password: process.env.DB_PASSWORD, 
  port: Number(process.env.DB_PORT),
});

client.connect()  
  .then(() => console.log("Conectat la baza de date PostgreSQL"))
  .catch((err) => console.error("Eroare la conectare:", err));

export default client;
