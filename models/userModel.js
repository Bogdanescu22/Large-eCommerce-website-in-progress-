import client from "../db.js";

// Obține un utilizator după ID
const getUserById = async (id) => {
  try {
    const res = await client.query("SELECT * FROM users WHERE id = $1", [id]);
    return res.rows[0]; // Returnează utilizatorul
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Obține un utilizator după email
const getUserByEmail = async (email) => {
  try {
    const res = await client.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0]; // Returnează utilizatorul
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Adaugă un utilizator nou
const addUser = async (user) => {
  const { googleId, facebookId, displayName, email } = user;
  try {
    const res = await client.query(
      "INSERT INTO users (googleid, facebook_id, display_name, email) VALUES ($1, $2, $3, $4) RETURNING *",
      [googleId, facebookId, displayName, email]
    );
    return res.rows[0]; // Returnează utilizatorul adăugat
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Actualizează un utilizator
const updateUser = async (id, user) => {
  const fieldsToUpdate = [];
  const values = [];

  // Adăugăm fiecare câmp care există în obiectul user la query
  if (user.displayName) {
    fieldsToUpdate.push('display_name = $' + (fieldsToUpdate.length + 1));
    values.push(user.displayName);
  }
  if (user.email) {
    fieldsToUpdate.push('email = $' + (fieldsToUpdate.length + 1));
    values.push(user.email);
  }

  if (fieldsToUpdate.length === 0) {
    throw new Error("No fields provided for update");
  }

  // Se adaugă id-ul la sfârșit pentru WHERE
  values.push(id);

  const query = 'UPDATE users SET ' + fieldsToUpdate.join(', ') + ' WHERE id = $' + values.length + ' RETURNING *';

  try {
    const res = await client.query(query, values);
    return res.rows[0]; // Returnează utilizatorul actualizat
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Șterge un utilizator
const deleteUser = async (id) => {
  try {
    const res = await client.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rows[0]; // Returnează utilizatorul șters
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export { getUserById, getUserByEmail, addUser, updateUser, deleteUser };
