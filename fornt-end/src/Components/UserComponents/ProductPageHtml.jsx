
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
  const [reviewImage, setReviewImage] = useState(null);


  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await fetch("http://localhost:5000/auth/user", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Eroare la obținerea utilizatorului");
        }

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


  useEffect(()=>{
    if(!user_id) {return console.log("Nu exista user_id")} ;
    fetch(`http://localhost:5000/orders_fetch/${user_id}`, {credentials: "include"})
   .then((res) => res.json())
   .then((data) => {setVerifyOrder(data); console.log("Astea sunt datele primite",data)})
   .catch((err) => console.log("Eroare la obtinerea comenzilor", err));
    },[user_id])


  const postReview = () => {
    if(!product_id || !user_id) {
    return console.log("Nu exista user_id sau product_id!")
    }

    if(!starsReviews || !description) {
    return alert("Campurile nota si descriere sunt obligatorii!")
    }


    const verifyBoughtProduct = verifyOrder.some((order)=> order.product_name === name_product)

   if(!verifyBoughtProduct) {
    return alert("Nu ai cumparat acest produs!") }

    fetch(`http://localhost:5000/reviews_approval/${product_id}/${user_id}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        review_stars: starsReviews,
        description: description,
        profile_picture: userProfilePicture,
        image_url: reviewImage,

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


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReviewImage(reader.result); // imaginea în base64
      };
      reader.readAsDataURL(file);
    }
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
          <h2>Recenzii</h2>
          <div className="product-page-star-reviews-div">
            <div><h3>Adauga o nota</h3></div>
             <div>{[1, 2, 3, 4, 5].map((star) => (
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
          </div>
          <div className="product-page-details-div">
          <textarea 
          className={`product-page-input-details-div ${description.length > 500 ? "active1" : ""}`} 
          onChange={(e) => handleProductDescription(e)}
         placeholder="Descrie experienta ta cu produsul">
        </textarea>
          <p className={`char-limit-details-div ${description.length > 500 ? "active" : ""}`}>Ai depasit numarul maxim de caractere (500)!</p>
          </div>
          <div className="product-page-reviews-image-div">

          <div className="product-page-reviews-image-div-text">
            <p>Adauga o imagine</p>
            </div>      

          <input type="file" onChange={handleImageChange} accept="image/*" />
          {reviewImage && <img src={reviewImage} alt="Preview" style={{ width: '100px', height: '100px' }} />}

               
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
