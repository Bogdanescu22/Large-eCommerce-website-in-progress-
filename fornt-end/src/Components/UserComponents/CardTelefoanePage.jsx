import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Importăm useNavigate

function CardTelefoanePage({ productId, imgURL, name, price, category }) {
  const [userId, setUserId] = useState(null); // Stocăm userId
  const [cart, setCart] = useState([]); // Stocăm produsele adăugate în coș
  const navigate = useNavigate(); // Inițializăm navigate

  // Obținem userId la montarea componentei
  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await fetch("https://api.devsite.cfd/auth/user", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Eroare la obținerea utilizatorului");
        }

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
  }, []);

  // Funcția de adăugare în coș
  const handleButtonClick = async () => {
    if (!userId) {
      alert("Trebuie să fii autentificat pentru a adăuga produse în coș.");
      return;
    }

    const newProduct = {
      product_name: name,
      product_price: price,
      product_id: productId,
      product_img: imgURL,
      quantity: 1,
    };

    // Adăugăm cererea OPTIONS pentru preflight
    try {
      const optionsResponse = await fetch('https://api.devsite.cfd/cart', {
        method: 'OPTIONS',
        headers: {
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type',
          'Origin': 'https://www.devsite.cfd',
        },
      });
      console.log('OPTIONS Response Status:', optionsResponse.status); // Arată statusul 204

      if (optionsResponse.status !== 204) {
        throw new Error("Cererea OPTIONS nu a avut succes.");
      }

      // Acum facem cererea POST
      const response = await fetch("https://api.devsite.cfd/cart", {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          product_id: newProduct.product_id,
          product_name: newProduct.product_name,
          product_price: newProduct.product_price,
          product_img: newProduct.product_img,
          quantity: newProduct.quantity,
        }),
      });

      if (!response.ok) {
        throw new Error("Eroare la adăugarea produsului în coș");
      }

      const result = await response.json();
      setCart((prevCart) => [...prevCart, result.product]); // Actualizăm coșul
      alert("Produsul a fost adăugat în coș!");
    } catch (error) {
      console.error("Eroare la adăugarea produsului:", error);
      alert("Eroare la adăugarea produsului în coș");
    }
  };

  return (
    <div className="phone-card">
      {/* Înlocuim <Link to={...}> cu navigate() */}
      <img
        className="phone-card-image"
        src={imgURL}
        alt={name}
        onClick={() => navigate(`/products/${name}`)} // Navighează fără refresh
        style={{ cursor: "pointer" }} // Schimbăm cursorul la hover
      />
      <h2
        className="phone-card-title"
        onClick={() => navigate(`/products/${name}`)}
        style={{ cursor: "pointer" }}
      >
        {name}
      </h2>
      <h3 className="phone-card-price">${price}</h3>
      <button className="phone-card-button" onClick={handleButtonClick}>
        Adaugă în coș
      </button>
    </div>
  );
}

export default CardTelefoanePage;
