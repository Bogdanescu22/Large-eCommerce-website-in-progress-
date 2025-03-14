import React from "react";
import Header from "../UserComponents/Header";
import Footer from "../UserComponents/Footer";

const ProductDetails = ({ product }) => {
  return (
    <>
      <Header />
      <div className="productPage-main">
        <div className="productPage-productTitle">
          <h1>{product.name}</h1>
        </div>
        <div className="image_cartinfo-div">
          <div className="product-page-image">
            <img src={product.image_url} alt={product.name} />
          </div>
          <div className="cartinfo-prodcut-page">
            <p className={`product-page-stock ${product.stock > 0 ? "disponibil" : "indisponibil"}`}>
              {product.stock > 0 ? "In stoc" : "Stoc epuizat"}
            </p>
            <p className="product-page-price">Preț: ${product.price}</p>
            <button className="product-page-cart-button">Adaugă în coș</button>
          </div>
        </div>
        <div className="product-page-details">
          <h2>Detalii</h2>
          <p>{product.product_details || "Nu sunt detalii disponibile."}</p>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetails;
