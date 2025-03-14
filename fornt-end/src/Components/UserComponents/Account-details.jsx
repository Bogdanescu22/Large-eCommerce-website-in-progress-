import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import CardDetailsPage from "./CardDetailsPage";
import { useNavigate } from "react-router";
import AccountDetailsCardDiv from "./Account-details-card-div";

function AccountDetails() {
  const [user, setUser] = useState({}); // Inițializăm ca obiect gol
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);  // State pentru erori
  const [products, setProducts] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

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
      return;  // Ieși din useEffect dacă user.id nu este definit
    }
    fetch(`http://localhost:5000/orders_fetch/${user.id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Răspuns server orders_fetch:", data)
        setOrders(data);
      })
      .catch((error) => console.error("Eroare:", error));
  }, [user.id]);
  

  return (
    <div className="account-details-page">
      <Header />
      <main>
        <div className="details-logout-div">
          <div className="details-div">
            <h1>Detalii cont:</h1>
            {user ? (
              <>
                <p>Nume utilizator: <span className="details-span">{user.displayname}</span></p>
                <p>ID utilizator: <span className="details-span">{user.id}</span></p>
                <p>Adresa: <span className="details-span">{user.address || "N/A"}</span></p>
              </>
            ) : (
              <p>Se încarcă...</p>
            )}
          </div>
          <div className="details-logout-button">
            <button className="details-logout" onClick={() => window.location.href = "http://localhost:5000/logout"}>
              Logout
            </button>
          </div>
          {error && <div className="error-message">{error}</div>}  {/* Afișează eroarea */}
        </div>
        <div className="details-orders-history-div">
          <h2>Istoric comenzi:</h2>
          <div className="orders-history-cards-div">
           <AccountDetailsCardDiv 
          />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default AccountDetails;
