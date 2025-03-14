
import React, { useState, useEffect } from "react";

function CardCartPage({ imgURL, title, quantity, price, onStockCheck, user_id, onDelete, updateTotal}) {
  const [stock, setStock] = useState(null);
  const [currentQuantity, setCurrentQuantity] = useState(quantity);
  const [productID, setProductID]=useState(null);
  const [deleteItem, setDeleteItem]=useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((products) => {
        const foundProduct = products.find((product) => product.image_url === imgURL);
        if (foundProduct) {
          setStock(foundProduct.stock);
          setProductID(foundProduct.id);
          console.log("📌 productID setat:", foundProduct.id); // Debug
        } else {
          setStock(0);
          setProductID(null);
          console.log("❌ productID este null!"); // Debug
        }
      })
      .catch((err) => console.log("Eroare la fetch", err));
}, [imgURL]);


  const stockInfo = quantity > stock? "indisponibil" : "disponibil" ;

  useEffect(()=>
  {
  onStockCheck(imgURL,stockInfo)
  },[imgURL,stockInfo]);


  const updateQuantityInDatabase = (newQuantity) => {
    if (!productID || !user_id) return;

    fetch(`http://localhost:5000/cart/quantity/update/${productID}/${user_id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({quantity: newQuantity}), 
        credentials: "include"
    })
    .then((res) => res.json())
    .then((data) => {
        updateTotal(price, newQuantity > currentQuantity)
        console.log("✅ Răspuns server:", data);
    })
    .catch((err) => console.log("❌ Eroare la actualizarea cantității:", err));
};


const Increase = () => {
  const newQuantity = currentQuantity + 1;
  setCurrentQuantity(newQuantity); // Setează cantitatea pe frontend
  updateQuantityInDatabase(newQuantity)
};

const Decrease = () => {
  if (currentQuantity > 1) {
    const newQuantity = currentQuantity - 1;
    setCurrentQuantity(newQuantity); // Setează cantitatea pe 
    updateQuantityInDatabase(newQuantity)
  }
};

const deleteCartProduct= () => {
  fetch(`http://localhost:5000/cart/delete/${user_id}/${productID}`,{
  method:"DELETE",
  credentials:"include"})
  .then((res)=>res.json())
  .then((data) => {
  console.log("✅ Răspuns server (Ștergere):", data)
  onDelete(productID)
  setDeleteItem(true) })
  .catch((err) => console.log("Eroare la stergerea produsului:", err))
  };



  return (
    <div className={`cart-card ${deleteItem? "active" : ""}`}>
      <div className="image-CartCard-div">
        <img className="image-CartCard" src={imgURL} alt={title} />
      </div>
      <div className="title-quantity-CartCard">
        <h2 className="title-CartCard">{title}</h2>
        <div className="quantity-CartCard">

           <span className="add-quantity"><button onClick={Increase}><svg width="17" height="13" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
               <rect width="10" height="40" x="15" fill="#afb1b8"/>
               <rect width="40" height="10" y="15" fill="#afb1b8"/>
            </svg></button></span>

          Cantitate: {currentQuantity}

           <span className="minus-quantity"><button onClick={Decrease}><svg width="15" height="10" viewBox="0 0 40 10" xmlns="http://www.w3.org/2000/svg">
             <rect width="40" height="10" rx="2" fill="#afb1b8"/>
            </svg></button></span>
        </div>
      </div>
      <div className="price-disponibility-CartCard">
        <h2 className="price-CartCard">${price}</h2>
        <p className={stockInfo === "indisponibil" ? "indisponibil" : "disponibil"}>
          {stockInfo === "indisponibil"
            ? "Nu e disponibil în cantitatea selectată"
            : "Disponibil în cantitatea selectată"}
        </p>
      </div>
      <div className="cart-delete-button">
      <button onClick={deleteCartProduct}>X</button>
      </div>
    </div>
  );
}

export default CardCartPage;