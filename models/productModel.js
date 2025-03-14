import client from "../db.js";

// Obține toate produsele
const getAllProducts = async () => {
  try {
    const res = await client.query("SELECT * FROM products");
    return res.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Obține un produs după ID
const getProductById = async (id) => {
  try {
    const res = await client.query("SELECT * FROM products WHERE id = $1", [id]);
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Adaugă un produs
const addProduct = async (product) => {
  const { name, description, price, image_url, stock, category, product_details } = product;
  try {
    const res = await client.query(
      "INSERT INTO products (name, description, price, image_url, stock, category, product_details) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [name, description, price, image_url, stock, category, product_details]
    );
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Actualizează un produs
const updateProduct = async (id, product) => {
  const fieldsToUpdate = [];
  const values = [];

  // Adăugăm fiecare câmp care există în obiectul product la query
  if (product.name) {
    fieldsToUpdate.push('name = $' + (fieldsToUpdate.length + 1));
    values.push(product.name);
  }
  if (product.description) {
    fieldsToUpdate.push('description = $' + (fieldsToUpdate.length + 1));
    values.push(product.description);
  }
  if (product.price) {
    fieldsToUpdate.push('price = $' + (fieldsToUpdate.length + 1));
    values.push(product.price);
  }
  if (product.image_url) {
    fieldsToUpdate.push('image_url = $' + (fieldsToUpdate.length + 1));
    values.push(product.image_url);
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error("No fields provided for update");
  }

  // Se adaugă id-ul la sfârșit pentru WHERE
  values.push(id);

  const query = 'UPDATE products SET ' + fieldsToUpdate.join(', ') + ' WHERE id = $' + values.length + ' RETURNING *';
  
  try {
    const res = await db.query(query, values);
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};


// Șterge un produs
const deleteProduct = async (id) => {
  try {
    const res = await client.query("DELETE FROM products WHERE id = $1 RETURNING *", [id]);
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct };
