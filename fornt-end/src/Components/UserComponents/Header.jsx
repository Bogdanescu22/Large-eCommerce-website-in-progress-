import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const [isLogged, setIsLogged] = useState(false);
  const navigate = useNavigate();
  const [showSearch, setShowSearch] = useState(false);
  const [menu, setMenu] = useState(false);
  const [cartCount, setCartCount] = useState();
  const [userID, setUserID] = useState();
  const [text, setText] = useState(""); // ✅ Folosim "text" în loc de "searchText"

  // Verificarea autentificării
  useEffect(() => {
    fetch("https://13.61.15.214:5000/check-auth", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setIsLogged(data.isLogged);
        setUserID(data.user.id); // Setează și userID într-un singur bloc de cod
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handleAuthButtonClick = () => {
    if (isLogged) {
      navigate("/account-details");
    } else {
      navigate("/login");
    }
  };

  useEffect(() => {
    if (userID) {
      fetch(`https://13.61.15.214:5000/cart/total-quantity/${userID}`, { credentials: "include" })
        .then((res) => res.json())
        .then((data) => setCartCount(data.total_quantity || 0))
        .catch((error) => console.error("Error:", error));
    }
  }, [userID]);

  const searchTextInput = (event) => {
    if (event.key === "Enter" && text.trim() !== "") {
      navigate(`/search-result/${text}`);
    } else if (text.trim() === "") {
      return console.log("SearchBar-ul e gol");
    }
  };

  return (
    <div className={`header ${menu ? "active" : ""}`}>
      {/* Overlay pentru căutare */}
      {showSearch && (
        <div className="search-overlay active">
          <input
            type="text"
            placeholder="Caută un produs..."
            className="search-input"
            onChange={(e) => setText(e.target.value)} // ✅ Corect
            onKeyDown={searchTextInput}
          />
          <button onClick={() => setShowSearch(false)} className="close-button">X</button>
        </div>
      )}

      <div className={`logo ${menu ? "active" : ""}`}>
        <a href="/">
          <img src="/images/Black Circle Icon Business Logo.png" width="80" alt="Logo" />
        </a>
      </div>

      {/* Meniu */}
      <div className="menu">
        <div className={`toggle-menu ${menu ? "active" : ""}`}>
          <div className="menuDiv"><p>Contact Page</p></div>
          <div className="menuDiv"><p>About us</p></div>
          <div className="menuDiv">
            <button className={`logInButton ${menu ? "active" : ""}`} onClick={handleAuthButtonClick}>
              {isLogged ? "My Account" : "Log In"}
            </button>
          </div>
        </div>

        {/* Buton de căutare */}
        <button className={`searchButton ${menu ? "active" : ""}`} onClick={() => setShowSearch(true)}>
          <div className="magnifierDiv">
            <img src="/Images/[CITYPNG.COM]Magnifying Glass, Search White Icon Transparent PNG - 2000x2000.png" width="30" />
          </div>
        </button>

        {/* Buton de coș */}
        <button className={`cartButton ${menu ? "active" : ""}`} onClick={() => (window.location.href = "/cart")}>
          <div className="cartDiv">
            <img className="cartButton-image" src="/Images/_Pngtree_vector_shopping_cart_icon_4142519-removebg-preview (1).png" width="40" />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </div>
        </button>

        <button className="toggle-button" onClick={() => { setMenu(!menu); }}>{menu ? "X" : "☰"}</button>
      </div>
    </div>
  );
}

export default Header;
