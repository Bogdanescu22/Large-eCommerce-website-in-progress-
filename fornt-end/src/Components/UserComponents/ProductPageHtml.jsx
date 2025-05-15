import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

function ProductPageHtml({ name_product, image_product, stock_product, product_price, product_details, product_id }) {
  const [starsReviews, setStarsReviews] = useState(0);
  const [description, setDescription] = useState("");
  const [user_id, setUser_Id] = useState(null);
  const [hoveredStars, setHoveredStars] = useState(0);
  const [userProfilePicture, setUserProfilePicture] = useState(null);
  const [verifyOrder, setVerifyOrder] = useState("");
  const [reviewImage, setReviewImage] = useState(null); // va fi un file, nu base64

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await fetch("https://api.devsite.cfd/auth/user", { credentials: "include" });
        const data = await response.json();
        if (data.user) {
          setUser_Id(data.user.id);
          setUserProfilePicture(data.user.profile_picture);
        } else {
          alert("Nu ești autentificat");
        }
      } catch (error) {
        console.error("Eroare:", error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (!user_id) return;
    fetch(`https://api.devsite.cfd/orders_fetch/${user_id}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setVerifyOrder(data))
      .catch((err) => console.log("Eroare la obtinerea comenzilor", err));
  }, [user_id]);

  const postReview = async () => {
    if (!product_id || !user_id) return alert("Nu există user_id sau product_id!");
    if (!starsReviews || !description) return alert("Campurile notă și descriere sunt obligatorii!");
  
    const verifyBoughtProduct = verifyOrder.some((order) => order.product_name === name_product);
    if (!verifyBoughtProduct) return alert("Nu ai cumpărat acest produs!");
  
    let imageUrl = "";
  
    // 1. Uploadează imaginea dacă există
    if (reviewImage) {
      const imageForm = new FormData();
      imageForm.append("file", reviewImage);
  
      try {
        const uploadRes = await fetch("https://api.devsite.cfd/upload-image", {
          method: "POST",
          body: imageForm,
        });
        const uploadData = await uploadRes.json();
        imageUrl = uploadData.url; // link-ul de CloudFront
      } catch (error) {
        console.error("❌ Eroare la upload imagine:", error);
        alert("Eroare la urcarea imaginii.");
        return;
      }
    }
  
    // 2. Trimite review-ul + URL imagine
    const reviewForm = new FormData();
    reviewForm.append("review_stars", starsReviews);
    reviewForm.append("description", description);
    reviewForm.append("profile_picture", userProfilePicture || "");
    reviewForm.append("image_url", imageUrl);
  
    try {
      const res = await fetch(`https://api.devsite.cfd/reviews_approval/${product_id}/${user_id}`, {
        method: "POST",
        body: reviewForm,
      });
      if (!res.ok) throw new Error("Eroare la adăugarea review-ului");
      const data = await res.json();
      alert("✅ Review trimis cu succes!");
    } catch (error) {
      console.error("❌", error);
      alert("Eroare la trimiterea review-ului.");
    }
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReviewImage(file); // direct fișier, fără FileReader
    }
  };

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
          <h2>Recenzii</h2>
          <div className="product-page-star-reviews-div">
            <div><h3>Adaugă o notă</h3></div>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setStarsReviews(star)}
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
          </div>

          <div className="product-page-details-div">
            <textarea
              className={`product-page-input-details-div ${description.length > 500 ? "active1" : ""}`}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrie experiența ta cu produsul"
            ></textarea>
            <p className={`char-limit-details-div ${description.length > 500 ? "active" : ""}`}>
              Ai depășit numărul maxim de caractere (500)!
            </p>
          </div>

          <div className="product-page-reviews-image-div">
            <div className="product-page-reviews-image-div-text">
              <p>Adaugă o imagine</p>
            </div>
            <input type="file" onChange={handleImageChange} accept="image/*" />
            {reviewImage && (
              <p style={{ fontSize: "14px" }}>Imagine selectată: {reviewImage.name}</p>
            )}
          </div>

          <div className="product-page-reviews-button-div">
            <button onClick={postReview}>Trimite</button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ProductPageHtml;


