import client from "../db.js";
import { v4 as uuidv4 } from "uuid"; // Pentru generarea de UUID

// Adaugă o nouă comandă
export const addOrder = async (userId, billingInfo, items) => {
  const orderId = uuidv4();
  
  try {
    // Creăm comanda în tabelul orders
    const orderResult = await client.query(
      `INSERT INTO orders (id, user_id, billing_info) VALUES ($1, $2, $3) RETURNING *`,
      [orderId, userId, billingInfo]
    );

    // Adăugăm produsele comandate în order_items
    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)`,
        [orderId, item.productId, item.quantity, item.price]
      );
    }

    return orderResult.rows[0]; // Returnăm comanda creată
  } catch (err) {
    throw err;
  }
};

// Obține toate comenzile unui utilizator
export const getOrdersByUserId = async (userId) => {
  try {
    const result = await client.query(
      `SELECT * FROM orders WHERE user_id = $1`,
      [userId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};

// Obține detalii despre o comandă (inclusiv produsele)
export const getOrderDetails = async (orderId) => {
  try {
    const result = await client.query(
      `SELECT * FROM order_view WHERE order_id = $1`,
      [orderId]
    );
    return result.rows;
  } catch (err) {
    throw err;
  }
};
