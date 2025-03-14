import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

// Creăm o instanță a clientului
const client = new pg.Client({
  user: process.env.DB_USER,       // trebuie să fie un string
  host: process.env.DB_HOST,       // trebuie să fie un string
  database: process.env.DB_DATABASE, // trebuie să fie un string
  password: process.env.DB_PASSWORD, // trebuie să fie un string
  port: Number(process.env.DB_PORT), // trebuie convertit la număr
});

client.connect()  
  .then(() => console.log("Conectat la baza de date PostgreSQL"))
  .catch((err) => console.error("Eroare la conectare:", err));

export default client;
