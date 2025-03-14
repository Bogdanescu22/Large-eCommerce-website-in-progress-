import React, {useState, useEffect} from "react";
import CardDetailsPage from "./CardDetailsPage";

const AccountDetailsCardDiv = () => {

  const [user, setUser] = useState({}); 
  const [orders, setOrders] = useState([]);
  //const [error, setError] = useState(null);  
  //const [products, setProducts] = useState([]);
  //const [orderItems, setOrderItems] = useState([]);

// Fetch user
  useEffect(() => {
    fetch("http://localhost:5000/auth/user", { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Eroare la obținerea utilizatorului");
        }
        return res.json();
      })
      .then(({ user }) => setUser(user))
      .catch((error) => console.error("Eroare:", error));
  }, []);

  // Fetch orders - DEPENDENȚĂ PE user.id
  useEffect(() => {
    console.log("User ID înainte de fetch:", user.id); 
    if (!user.id) {
      console.log("ID-ul utilizatorului nu este definit.");
      return;
    }
    
    fetch(`http://localhost:5000/orders_fetch/${user.id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Răspuns server orders_fetch:", data);
  
        // Grupăm comenzile după order_id
     const groupeOrders = data.reduce ((acc, order) => {
       if(!acc[order.order_id]){
        acc[order.order_id] ={
          order_id: order.order_id,
          total_price: order.total_price,
          products: []
        }
       }

       acc[order.order_id].products.push({
          product_id: order.product_id,
          product_name: order.product_name,
          product_price: order.product_price,
          image_url: order.image_url,
          quantity: order.quantity
       })

       return acc;
     }, {});
  
        setOrders(Object.values(groupeOrders)); // Convertim obiectul într-un array
      })
      .catch((error) => console.error("Eroare:", error));
  }, [user.id]);
  

  return (
    <div className="account-details-card-div1">
      {orders.map((order) => (
        <div className="account-details-card-div2" key={order.order_id}>
          <div className="account-details-card-div-h2">
            <div><h2>Id comanda: #<span>{order.order_id}</span></h2></div>
            <div className="account-details-card-div-h2-total"><h2>Total: <span>${order.total_price}</span></h2></div>
          </div>
          <div className="account-details-card">
          {order.products.map((product) => (
            <CardDetailsPage
              key={product.product_id}
              imgURL={product.image_url}
              title={product.product_name}
              product_price={product.product_price}
              product_quantity={product.quantity}
            />
          ))}
          </div>
        </div>
      ))}
    </div>
  );
  
};

export default AccountDetailsCardDiv;