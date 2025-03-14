import client from "../db.js";

// Obține un admin după email
export const getAdminByEmail = async (email) => {
  try {
    const res = await client.query("SELECT * FROM admins WHERE email = $1", [email]);
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Adaugă un admin nou
export const addAdmin = async (admin) => {
  const { name, email, password } = admin;
  try {
    const res = await client.query(
      "INSERT INTO admins (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    return res.rows[0];
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export async function getAdminByResetToken(token) {
  try {
    const res = await client.query(
      "SELECT * FROM admins WHERE resetPasswordToken = $1 LIMIT 1",
      [token]
    );
    return res.rows.length > 0 ? res.rows[0] : null;
  } catch (err) {
    console.error("Eroare la getAdminByResetToken:", err);
    throw err;
  }
}



