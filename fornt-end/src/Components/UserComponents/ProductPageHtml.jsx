
import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function ProductPageHtml({ name_product, image_product, stock_product, product_price, product_details, product_id }) {
  const [starsReviews, setStarsReviews] = useState(0); // 🔥 Corectat numele
  const [description, setDescription] = useState("");
  const [user_id, setUser_Id] = useState(null);
  const [hoveredStars, setHoveredStars] = useState(0);

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await fetch("http://13.61.15.214:5000/auth/user", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Eroare la obținerea utilizatorului");
        }

        const data = await response.json();

        if (data.user) {
          setUser_Id(data.user.id);
        } else {
          alert("Nu ești autentificat");
        }
      } catch (error) {
        console.error("Eroare:", error);
      }
    };

    getUserId(); // 🔥 Trebuia apelată funcția!
  }, []); // 🔥 Închide corect `useEffect`

  const postReview = () => {
    if(!product_id || !user_id) {
    return console.log("Nu exista user_id sau product_id!")
    }

    if(!starsReviews || !description) {
    return alert("Campurile nota si descriere sunt obligatorii!")
    }
    fetch(`http://13.61.15.214:5000/reviews_approval/${product_id}/${user_id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_stars: starsReviews,
        description: description,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Eroare la adăugarea review-ului");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Review adăugat cu succes:", data);
      })
      .catch((error) => {
        console.error("Eroare la adăugarea review-ului:", error);
        alert("Eroare la adăugarea review-ului");
      });
  };

  const handleStarClick = (index) => {
    setStarsReviews(index);
  };


  const handleProductDescription = (e) => {
  const {value}=e.target;
  setDescription(value);
  console.log("Asta e descrierea:", value)
  }

  return (
    <>
      <Header />
      <div className="productPage-main">
        <div className="productPage-productTitle">
          <h1>{name_product}</h1>
        </div>

        <div className="image_cartinfo-div">
          <div className="product-page-image">
            <img src={image_product} alt={name_product} />
          </div>

          <div className="cartinfo-prodcut-page">
            <p className={`product-page-stock ${stock_product > 0 ? "disponibil" : "indisponibil"}`}>
              {stock_product > 0 ? "In stoc" : "Stoc epuizat"}
            </p>
            <p className="product-page-price">Preț: ${product_price}</p>
            <button className="product-page-cart-button">Adaugă în coș</button>
          </div>
        </div>

        <div className="product-page-details">
          <h2>Detalii</h2>
          <p>{product_details || "Nu sunt detalii disponibile."}</p>
        </div>

        <div className="product-page-reviews-description-div">
          <div className="product-page-star-reviews-div">
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredStars(star)}
                onMouseLeave={() => setHoveredStars(0)}
                style={{
                  fontSize: "24px",
                  cursor: "pointer",
                  color: star <= (hoveredStars || starsReviews) ? "gold" : "grey",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <div className="product-page-details-div">
          <input className={`product-page-input-details-div ${description.length > 500 ? "active1" : ""}`} onChange={(e)=>handleProductDescription(e)} type="text" placeholder="Descrie experienta ta cu produsul">
          </input>
          <p className={`char-limit-details-div ${description.length > 500 ? "active" : ""}`}>Ai depasit numarul maxim de caractere (500)!</p>
          </div>
          <div className="product-page-reviews-button-div">
          <button onClick={(e)=>postReview(e)}>Trimite</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductPageHtml;
