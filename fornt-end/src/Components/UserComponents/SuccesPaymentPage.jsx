
import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

const SuccesPage = () => {
  const [userName, setUserName] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [userId, setUserId] = useState(null);

  // Fetch pentru userId
  useEffect(() => {
    fetch("https://api.devsite.cfd/auth/user", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("🟢 User data:", data);
        setUserName(data.user.displayname ? data.user.displayname.split(" ")[0] : "");
        setUserId(data.user.id);
      })
      .catch((err) => console.error("❌ Eroare la obținerea numelui utilizatorului", err));
  }, []);

  // Fetch pentru orderId - rulează DOAR când `userId` este valid
  useEffect(() => {
    if (!userId) {
      console.warn("⚠️ userId este null, nu facem fetch pentru orderId.");
      return;
    }

    console.log(`🟡 Fetching order for userId: ${userId}`);

    fetch(`https://api.devsite.cfd/orders/latest_order/${userId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((result) => {
        console.log("🟢 Order data:", result);
        if (result[0].id) {
            setOrderId(result[0].id);
          } else {
            console.warn("⚠️ Order data nu conține un ID valid.");
          }
        })
      .catch((err) => console.error("❌ Eroare la obținerea ultimului ID din orders", err));
  }, [userId]); // Acest useEffect rulează doar când `userId` se schimbă

  return (
    <div className="succesPage">
      <Header />
      <main className="succesPage-main">
        <div>
          <h2 className="succes-title">
            Multumim {userName}! Comanda ta cu id-ul <br></br> #{orderId} a fost plasata cu succes!
          </h2>
          <button className="continue-shopping-button" onClick={() => window.location.href = "/"}>
            Continua cumparaturile
          </button>
        </div>
        
      </main>
      <Footer />
    </div>
  );
};

export default SuccesPage;

  