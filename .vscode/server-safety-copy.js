/*import express from "express";
import client from "./db.js";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { v4 as uuidv4 } from "uuid";
import {getUserByEmail,addUser,getUserById} from "./models/userModel.js";
import {getAllProducts,getProductById,addProduct,updateProduct,deleteProduct} from "./models/productModel.js";
import {addOrder,getOrdersByUserId,getOrderDetails} from "./models/ordersModel.js";
import { getAdminByEmail, addAdmin, updateAdmin, getAdminByResetToken} from "./models/adminModel.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";  // Adăugat pentru încărcarea fișierului .env
import Stripe from "stripe";
import { error } from "console";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();  // Încărcăm variabilele de mediu din .env

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cookieParser()); // Adăugăm cookie-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000", // Permite cereri de la localhost:3000
    credentials: true, // Permite transmiterea de cookies și sesiuni
  })
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Configurarea Passport pentru Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: "137116061424-gd6msgnj9lod2famqpfchrim31jkncbo.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:5000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await getUserByEmail(email);

        if (!user) {
          const newUser = {
            googleId: profile.id,
            facebookId: null,
            displayName: profile.displayName || email.split("@")[0],
            email,
          };
          user = await addUser(newUser);
        }

        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    }
  )
);

// Configurarea Passport pentru Facebook OAuth
passport.use(
  new FacebookStrategy(
    {
      clientID: "970411857749968",
      clientSecret: "59d84c5086035d3dc5717c01097782fd",
      callbackURL: "http://localhost:5000/auth/facebook/callback",
      profileFields: ["id", "displayName", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let user = await getUserByEmail(email);

        if (!user) {
          const newUser = {
            googleId: null,
            facebookId: profile.id,
            displayName: profile.displayName,
            email,
          };
          user = await addUser(newUser);
        }

        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err, null);
      }
    }
  )
);

// Middleware

app.use(
  session({
    secret: "c7e4a8d9f1b62c3d8f6a4e5b7d2c9f1e0a7b4d6e8c3f1a5d9e2b7c4a6f8d3e1",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());


// Serialize și Deserialize User
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Autentificare Google
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  res.redirect("http://localhost:3000");
});

// Autentificare Facebook
app.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }));

app.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req, res) => {
  res.redirect("http://localhost:3000");
});


app.get("/check-auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ isLogged: true, user: req.user });
  } else {
    res.json({ isLogged: false });
  }
});

app.get('/auth/user', (req,res)=> {
if(req.isAuthenticated()) {
res.json({user: req.user})
} else {
res.status(401).json({message:"Nu esti autentificat"})
}
});


app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("http://localhost:3000/");
  });
});


// Rutele API pentru produse
app.get("/products", async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la obținerea produselor", details: err.message });
  }
});





app.get('/products/:name', async(req, res) => {
const name = req.params.name;

try{

const query='SELECT * FROM products WHERE name=$1';

const result= await client.query(query,[name]);

res.status(200).json(result.rows[0])

} catch (err){
console.error(err);
res.status(500).json({err: "Eroare la obtinerea datelor produsului", details:err.message})
}
});





//Rute pt cardurile din paginile pt produse//
app.get("/telefoane-cards", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, image_url, name, price, category FROM products WHERE category = 'telefoane'"
    );
    res.json(result.rows); 
  } catch (err) {
    res.status(500).json({ error: "Eroare la interogarea bazei de date!" });
  }
}); 

app.get("ceasuri-cards", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, image_url, title, price FROM products WHERE category = 'ceasuri'"
    );
    res.json(result.rows); // Returnează doar produsele din categoria "telefoane"
  } catch (err) {
    res.status(500).json({ error: "Eroare la interogarea bazei de date!" });
  }
});

app.get("/tablete-cards", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, image_url, title, price FROM products WHERE category = 'tablete'"
    );
    res.json(result.rows); // Returnează doar produsele din categoria "telefoane"
  } catch (err) {
    res.status(500).json({ error: "Eroare la interogarea bazei de date!" });
  }
});

app.get("/accesorii si periferice-cards", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, image_url, title, price FROM products WHERE category = 'accesorii si periferice'"
    );
    res.json(result.rows); // Returnează doar produsele din categoria "telefoane"
  } catch (err) {
    res.status(500).json({ error: "Eroare la interogarea bazei de date!" });
  }
});

app.get("/televizoare si streaming-cards", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, image_url, title, price FROM products WHERE category = 'televizoare si streaming'"
    );
    res.json(result.rows); // Returnează doar produsele din categoria "telefoane"
  } catch (err) {
    res.status(500).json({ error: "Eroare la interogarea bazei de date!" });
  }
});

app.get("/boxe inteligente-cards", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, image_url, title, price FROM products WHERE category = 'boxe inteligente'"
    );
    res.json(result.rows); // Returnează doar produsele din categoria "telefoane"
  } catch (err) {
    res.status(500).json({ error: "Eroare la interogarea bazei de date!" });
  }
});

app.get("/desktops-cards", async (req, res) => {
  try {
    const result = await client.query(
      "SELECT id, image_url, title, price FROM products WHERE category = 'desktops'"
    );
    res.json(result.rows); // Returnează doar produsele din categoria "telefoane"
  } catch (err) {
    res.status(500).json({ error: "Eroare la interogarea bazei de date!" });
  }
});






//Endpoints pentru cardPage

app.post('/cart', async (req, res) => {
  const { user_id, product_id, product_name, product_price, quantity, product_img } = req.body;

  try {
    // Verificăm dacă produsul este deja în coș
    const checkQuery = 'SELECT * FROM cart WHERE user_id = $1 AND product_id = $2;';
    const checkResult = await client.query(checkQuery, [user_id, product_id]);

    if (checkResult.rows.length > 0) {
      // Dacă produsul există, actualizăm cantitatea și total_price
      const newQuantity = checkResult.rows[0].quantity + quantity;
      const newTotalPrice = newQuantity * product_price;

      const updateQuery = `
        UPDATE cart 
        SET quantity = $1, total_price = $2 
        WHERE user_id = $3 AND product_id = $4
        RETURNING *;
      `;
      const updateValues = [newQuantity, newTotalPrice, user_id, product_id];

      const updateResult = await client.query(updateQuery, updateValues);
      return res.status(200).json({ message: "Cantitatea produsului a fost actualizată!", product: updateResult.rows[0] });
    } else {
      // Dacă produsul NU există, îl inserăm în tabel
      const insertQuery = `
        INSERT INTO cart (user_id, product_id, product_name, product_price, quantity, total_price, img_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const insertValues = [user_id, product_id, product_name, product_price, quantity, quantity * product_price, product_img];

      const insertResult = await client.query(insertQuery, insertValues);
      return res.status(201).json({ message: "Produs adăugat în coș!", product: insertResult.rows[0] });
    }
  } catch (err) {
    console.error("Eroare la adăugarea în coș", err);
    return res.status(500).json({ error: "Eroare la adăugarea produsului în coș." });
  }
});


//Enpoint pt primirea informatiilor din cart


app.get('/cart/data/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  console.log("📌 Cerere primită pentru user_id:", user_id); 

  try {
    const query = 'SELECT * FROM cart WHERE user_id=$1;';
    console.log("📌 Executăm interogarea:", query);
    const result = await client.query(query, [user_id]);

    console.log("📌 Rezultatele interogării:", result.rows); // Vezi ce returnează exact
    if (result.rows.length === 0) {
      console.log("⚠️ Nu sunt produse în coș pentru acest user.");
      return res.status(400).json({message:"Nu sunt produse in cos pentru acest user!"}); // Returnează un array gol în loc de eroare
    }

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("❌ Eroare la obținerea produselor din coș:", err);
    res.status(500).json({ error: "Eroare la obținerea produselor din coș." });
  }
});


//Endpoint pt actualizarea cantitatii unui produs
app.put('/cart/:user_id/:product_id', async(req,res) =>{
const user_id=req.params.user_id;
const product_id=req.params.product_id;
const{quantity,product_price}=req.body;

const total_price=quantity*product_price;

try{

const query='UPDATE cart SET quantity=$1, total_price=$2 WHERE user_id=$3 AND product_id=$4 RETURNING *; ';

const values=[quantity,total_price,user_id,product_id];

const result= await client.query(query,values);

if(res.rows === 0) {
return res.status(404).json({message:"Produsul nu a fost gasit"});
}

res.status(200).json({message:"Cantitatea a fost actualizata", product: result.rows[0]});

}catch {
    console.error("Eroare la actualizarea produsului în coș", err);
    res.status(500).json({ error: 'Eroare la actualizarea produsului în coș.' });
}
});





//Endpoint pentru ștergerea unui produs din coș
app.delete('/cart/delete/:user_id/:product_id', async(req,res) => {

const user_id=req.params.user_id;
const product_id=req.params.product_id;

try{
const querry='DELETE FROM cart WHERE user_id=$1 AND product_id=$2 RETURNING *;';
const values=[user_id,product_id];

const result= await client.query(querry,values);

if(result.rowCount === 0) {return res.status(400).json({message:"Produsul nu a fost gasit in cos", err})};

res.status(200).json({message:"Produsul a fost sters din cos"});

}catch (err) {
console.err("Eroare la actualizarea produsului in cos", err);
res.status(500).json({message:"Eroare la stergerea produsului din cos", err});
}
}
);

//Endpoint pt calcularea totalului din cos

app.patch('/cart/quantity/update/:product_id/:user_id', async (req, res) => {
  const { user_id, product_id } = req.params;
  const { quantity: newQuantity, product_price } = req.body; // Preluăm noua cantitate și (opțional) prețul

  try {
    console.log("📥 Primit de la frontend:", { user_id, product_id, newQuantity, product_price });

    let finalProductPrice = product_price;

    // Dacă prețul nu e primit de la frontend, îl luăm din baza de date
    if (!finalProductPrice) {
      const priceQuery = 'SELECT product_price FROM cart WHERE product_id=$1 AND user_id=$2';
      const priceResult = await client.query(priceQuery, [product_id, user_id]);

      if (priceResult.rows.length === 0) {
        return res.status(404).json({ message: "Produsul nu a fost găsit în coș." });
      }

      finalProductPrice = priceResult.rows[0].product_price;
    }

    // Calculăm noul total_price
    const total_price = newQuantity * finalProductPrice;

    // Updatăm atât cantitatea, cât și total_price
    const updateQuery = 'UPDATE cart SET quantity=$1, total_price=$2 WHERE product_id=$3 AND user_id=$4 RETURNING *;';
    const updateValues = [newQuantity, total_price, product_id, user_id];

    const result = await client.query(updateQuery, updateValues);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Produsul nu a fost găsit în coș." });
    }

    console.log("📤 Rezultat query:", result.rows[0]);

    res.status(200).json({ message: "Cantitatea și prețul total au fost actualizate", cart: result.rows[0] });

  } catch (err) {
    console.error("❌ Eroare la actualizarea cantității și a prețului:", err);
    res.status(500).json({ message: "Eroare la modificarea cantității produsului din coș.", error: err });
  }
});




app.get('/cart/total/:user_id', async (req, res) => {
  const user_id = req.params.user_id;
  try {
    // Corect: Adăugăm "FROM cart" înainte de WHERE
    const query = 'SELECT SUM(total_price) as total FROM cart WHERE user_id=$1';

    const result = await client.query(query, [user_id]);

    res.status(200).json({ total: result.rows[0].total || 0 });
  } catch (err) {
    console.error("Eroare la calcularea totalului", err);
    res.status(500).json({ error: 'Eroare la calcularea totalului coșului.' });
  }
});


app.get('/cart/total-quantity/:user_id', async (req,res) => {
  const user_id= req.params.user_id;
  
  try{
  const query= 'SELECT SUM(quantity) as total_quantity FROM cart WHERE user_id=$1';
  
  const result=await client.query(query, [user_id]);

  res.status(200).json({total_quantity: result.rows[0].total_quantity})
  }

  catch (err){
  console.error(err)
  res.status(500).json({error: "Eroare la obtinerea cantitatii totale"})
  }
  });
  



// Endpoint pentru plasarea unei comenzi

app.post("/billing_info/:user_id", async (req,res) => {
const user_id = req.params.user_id;
const {full_name, email, phone, address, city, postal_code, country, county} = req.body;

if (!full_name || !email || !phone || !address || !city || !postal_code || !country || !county) {
  return res.status(400).json({ message: "Toate câmpurile sunt obligatorii (server.js)" });
}

try{
const query='INSERT INTO billing_info (user_id, full_name, email, phone, address, city, postal_code, country, county) VALUES ($1, $2, $3, $4 , $5, $6, $7, $8, $9) RETURNING *;';
const values=[user_id, full_name, email, phone, address, city, postal_code, country, county];

const result= await client.query(query,values);

if(result.rows.length === 0) {
return res.status(400).json({message:"Eroare la inserarea adresei si contactului clientului in tabelul billing_info"})};

res.status(200).json({mesaj:"Contactul si adresa clientului au fost introduse in billing_info",rezultat:[result.rows]});

} catch (err) {
console.error(err);
res.status(500).json({mesaj:"Eroare la Eroare la inserarea adresei si contactului clientului in tabelul billing_info", error:err.message})
}

});







app.post("/orders/:user_id", async (req,res)=>{ 
const user_id= req.params.user_id;
const {total_price, billing_id, payment_method} = req.body;

try{
const query='INSERT INTO orders (user_id, total_price, billing_id, payment_method) VALUES ($1, $2, $3, $4) RETURNING*;';
const values=[user_id, total_price, billing_id, payment_method];

const result= await client.query(query,values);

if(result.rows.length === 0) {
return res.status(400).json({mesaj:"Eroare la inserarea datelor in tabelul orders"})};

res.status(200).json(result.rows);

}catch(err){
console.error(err);
res.status(500).json({mesaj:"Eroare la adaugarea datelor in tabelul orders", error:err.message})
}

});



app.post("/order_items", async(req, res) =>{
const {quantity, price, product_id, order_id}= req.body;

try{
const query = 'INSERT INTO order_items (product_id, quantity, price, order_id) VALUES ($1, $2, $3, $4) RETURNING*;';
const values = [product_id, quantity, price, order_id];

const result = await client.query(query, values);

if(result.rows.length === 0) {
return res.status(400).json({mesaj:"Eroare la inserarea produsului in order_items"})};

res.status(200).json(result.rows);

} catch (err) {
console.error(err);
res.status(500).json({mesaj:"Eroare la inserarea produsului in order_items", error:err.message})
}
});


app.get("/orders/latest_order/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const query = 'SELECT id FROM orders WHERE user_id=$1 ORDER BY created_at DESC LIMIT 1;';
    const result = await client.query(query, [user_id]);

    console.log("Rezultatul interogării:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Nu s-a găsit nicio comandă pentru acest utilizator." });
    };

    res.json(result.rows); // Trimitem doar obiectul, nu array-ul
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la obținerea ultimului id din orders", details: err.message });
  }
});




app.get("/orders/:user_id", async (req, res) => {
  const user_id = req.params.user_id;

  try {
    const query = `
      SELECT 
        user_orders_view.order_id, 
        user_orders_view.quantity, 
        user_orders_view.total_price, 
        user_orders_view.product_name, 
        products.image_url, 
        user_orders_view.product_id
      FROM user_orders_view
      JOIN products ON user_orders_view.product_id = products.id 
      WHERE user_orders_view.user_id = $1
    `;

    const result = await client.query(query, [user_id]);

    res.json(result.rows); // Returnăm comenzile direct cu `image_url`
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la obținerea comenzilor", details: err.message });
  }
});



// Rutele API pentru administrare produse (admin)
app.post("/admin/products", async (req, res) => {
  const { name, description, price, image_url, stock, category, product_details } = req.body;
  
  if (!name || !description || !price || !image_url || !stock || !category || !product_details) {
    return res.status(400).json({ error: "Toate câmpurile sunt obligatorii" });
  }

  try {
    const newProduct = await addProduct({ name, description, price, image_url, stock, category, product_details });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la adăugarea produsului", details: err.message });
  }
});

// Rutele API pentru actualizarea produselor
app.put("/admin/products/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, image_url } = req.body;

  try {
    const updatedProduct = await updateProduct(id, { name, description, price, image_url });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Produsul nu a fost găsit" });
    }

    res.json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la actualizarea produsului", details: err.message });
  }
});

// Rutele API pentru ștergerea produselor
app.delete("/admin/products/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Produsul nu a fost găsit" });
    }
    res.json({ message: "Produsul a fost șters", product: deletedProduct });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la ștergerea produsului", details: err.message });
  }
});

// Cheia secretă din fișierul .env
const secretKey = process.env.SECRET_KEY;  // Aici citim cheia secretă din .env



app.post("/admin/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Toate câmpurile sunt obligatorii!" });
  }

  try {
    const existingAdmin = await getAdminByEmail(email);
    if (existingAdmin) {
      return res.status(400).json({ error: "Adminul cu acest email există deja!" });
    }

    // Criptăm parola
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creăm un nou admin
    const newAdmin = await addAdmin({ name, email, password: hashedPassword });

    res.status(201).json(newAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la crearea adminului", details: err.message });
  }
});

// Endpoint pentru autentificarea adminului (login)
app.post("/admin/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email-ul și parola sunt obligatorii!" });
  }

  try {
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ error: "Adminul nu a fost găsit!" });
    }

    // Comparăm parola introdusă cu cea criptată
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Parola incorectă!" });
    }

    // Generăm token-ul
    const token = jwt.sign({ id: admin.id, email: admin.email }, secretKey, {
      expiresIn: "1h", // Expiră după 1 oră
    });

    // Setăm token-ul într-un cookie HTTP-only
    res.cookie("adminToken", token, {
      httpOnly: true,   // Nu poate fi accesat de JavaScript
      secure: true,     // Se trimite doar prin HTTPS (dezactivează în dev cu `false`)
      sameSite: "Strict", // Previne atacurile CSRF
      maxAge: 3600000   // Expiră după 1 oră (3600000 ms)
    });

    res.json({ message: "Autentificare reușită!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la autentificare" });
  }
});

// Middleware pentru protejarea rutele administrative
const protectAdminRoute = (req, res, next) => {
  const token = req.cookies.adminToken; // Citim token-ul din cookie

  if (!token) {
    return res.status(401).json({ error: "Autentificare necesară!" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Token invalid sau expirat!" });
    }

    req.admin = decoded; // Adăugăm info despre admin în request
    next();
  });
};

// Rute admin protejate
app.post("/admin/products", protectAdminRoute, async (req, res) => {
  const { name, description, price, image_url } = req.body;

  if (!name || !description || !price || !image_url) {
    return res.status(400).json({ error: "Toate câmpurile sunt obligatorii" });
  }

  try {
    const newProduct = await addProduct({ name, description, price, image_url });
    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Eroare la adăugarea produsului", details: err.message });
  }
});

// Dashboard admin (accesibil doar administratorilor autentificați)
app.get("/admin/dashboard", protectAdminRoute, (req, res) => {
  res.send("Bine ai venit la dashboard-ul administratorului!");
});

// Endpoint pentru logout (ștergerea cookie-ului)
app.post("/admin/logout", (req, res) => {
  res.clearCookie("adminToken", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });

  res.json({ message: "Logout cu succes!" });
});










// Configurare Nodemailer pentru trimiterea emailurilor
const transporter = nodemailer.createTransport({
  service: "gmail", // Poți schimba providerul
  auth: {
    user: "pantelimonbogdanmihai92@gmail.com", // Înlocuiește cu emailul tău
    pass: "mjxr zfhn taok zcyr" // Folosește un app password, nu parola reală
  }
});

// Endpoint pentru solicitarea resetării parolei
app.post("/admin/reset-password", async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ error: "Adminul nu a fost găsit!" });
    }

    // Generăm un token securizat pentru resetare
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = new Date(Date.now() + 3600000); // Valabil 1 oră

    // Salvăm token-ul în baza de date
    await updateAdmin(admin.id, {
      resetPasswordToken: resetToken,
      resetPasswordExpires: resetTokenExpires
    });

    // Trimitem email cu link-ul de resetare
    const resetLink = `http://localhost:5000/admin/reset-password/${resetToken}`;
    const mailOptions = {
      from: "pantelimonbogdanmihai92@gmail.com",
      to: email,
      subject: "Resetare Parolă Admin",
      text: `Dă clic pe acest link pentru a-ți reseta parola: ${resetLink}`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: "Email-ul de resetare a fost trimis!" });
  } catch (err) {
    console.error("Eroare la trimiterea emailului:", err);
res.status(500).json({ error: `Eroare la trimiterea emailului: ${err.message}` });
  }
});

// Endpoint pentru schimbarea parolei
app.post("/admin/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const admin = await getAdminByResetToken(token);
    if (!admin || new Date(admin.resetPasswordExpires) < new Date()) {
      return res.status(400).json({ error: "Token invalid sau expirat!" });
    }

    // Criptăm noua parolă
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Creăm un obiect de actualizări
    const updates = {
      password: hashedPassword,
      resetPasswordToken: null,  // Ștergem token-ul
      resetPasswordExpires: null // Ștergem data de expirare
    };

    // Actualizăm admin-ul cu noile informații
    await updateAdmin(admin.id, updates);

    res.json({ message: "Parola a fost schimbată cu succes!" });
  } catch (err) {
    console.error("Eroare la resetarea parolei:", err);

    // 🔥 Trimite eroarea completă în Postman (pentru debugging)
    res.status(500).json({ error: "Eroare la resetarea parolei", details: err.message });
  }
});












//Endpoint pt payment intent cu Stripe
app.post("/create-payment-intent", async (req, res) => {
  const { amount, currency } = req.body;

  if (!currency || amount <= 0) {
    return res.status(400).json({ error: "Suma trebuie să fie mai mare decât 0" });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency || "usd",
      payment_method_types: ["card"],
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (err) {
    console.error("Eroare la crearea Payment Intent:", err);
    res.status(500).json({ error: err.message });
  }
});

//Endpoint pt verificarea statusului platii
app.get("/payment-status/:paymentIntentId", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(req.params.paymentIntentId);
    res.json({ status: paymentIntent.status });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Serverul rulează la adresa http://localhost:${PORT}`);
}); */