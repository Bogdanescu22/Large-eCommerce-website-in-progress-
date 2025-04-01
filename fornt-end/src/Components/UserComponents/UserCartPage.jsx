import React, { useState, useEffect } from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import CardCartPage from "./CardCartPage.jsx";

function UserCartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [total, setTotal] = useState(null);
  const [stockStatus, setStockStatus] = useState({});

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await fetch("https://api.devsite.cfd/auth/user", {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Eroare la obținerea utilizatorului");

        const data = await response.json();
        if (data.user) {
          setUserId(data.user.id);
        } else {
          alert("Nu ești autentificat");
        }
      } catch (error) {
        console.error("Eroare:", error);
      }
    };

    getUserId();
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`https://api.devsite.cfd/cart/data/${userId}`, {
          credentials: "include",
        });

        if (!response.ok) throw new Error("Eroare la obținerea produselor din coș");

        const result = await response.json();
        setCartItems(result);
      } catch (err) {
        console.error("❌ Eroare la obținerea produselor din coș:", err);
      }
    };

    fetchCartItems();
  }, [userId]);

  useEffect(() => {
    if (!userId || cartItems.length === 0) {
      setTotal(0);
      return;
    }

    fetch(`https://api.devsite.cfd/cart/total/${userId}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Eroare la preluarea totalului coșului");
        return res.json();
      })
      .then((data) => {
        setTotal(data.total !== undefined ? data.total : 0);
      })
      .catch((err) => console.error("Eroare la fetch:", err));
  }, [userId, cartItems]);

  function handleStockCheck(imgURL, stockInfo) {
    setStockStatus((prevValues) => {
      return {
        ...prevValues,
        [imgURL]: stockInfo,
      };
    });
  }

  const hasUnavailableItems = Object.values(stockStatus).includes("indisponibil");

  const handleClick = () => {
    if (hasUnavailableItems) {
      alert("Produsele nu sunt disponibile în cantitatea aleasă!");
    } else {
      window.location.href = "https://www.devsite.cfd/telefoane/checkout";
    }
  };

  const handleDeleteItem = (productID) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product_id !== productID));
  };

  const updateTotal = (price, isIncrease) => {
    setTotal((prevTotal) => (isIncrease ? parseFloat(prevTotal) + parseFloat(price) : parseFloat(prevTotal) - parseFloat(price)));
  };

  return (
    <div className="cartPage">
      <Header />
      <main>
        <div className="cart-cards-div">
          {cartItems.length > 0 ? (
            cartItems.map((cart) => (
              <CardCartPage
                key={cart.id}
                user_id={cart.user_id}
                imgURL={cart.img_url}
                title={cart.product_name}
                quantity={cart.quantity}
                price={cart.product_price}
                onStockCheck={handleStockCheck}
                onDelete={handleDeleteItem}
                updateTotal={updateTotal}
              />
            ))
          ) : (
            <p>Coșul tău este gol!</p>
          )}

          <div className="total-CartPage-div">
            <h2 className="total-CartPage">Total: ${total}</h2>
          </div>
          <button className="button-CartPage" onClick={handleClick}>
            Finalizare Comandă
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default UserCartPage;
