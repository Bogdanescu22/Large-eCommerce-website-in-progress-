import React from "react";

function CardDetailsPage({ imgURL,  title,  product_quantity, product_price }) {
  return (
    <div className="details-card">
      <div className="image-text-details-div">
          <div className="details-card-img-div">
            <img src={imgURL} alt={title} />
          </div>
          <div className="details-card-text-div">
            <h2 className="details-card-title">{title}</h2>
            <p className="details-card-price">${product_price}</p>
          </div>
      </div>
      <div className="quantity-details-div">
        <p>x{product_quantity}</p>
      </div>
    </div>
  );
}

export default CardDetailsPage;
