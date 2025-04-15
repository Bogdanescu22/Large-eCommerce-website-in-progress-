import React from "react";
import { useNavigate } from "react-router";

function CardHomePage (props) {

  const navigate = useNavigate();

return (
<div className="product-card">
    <div className="home-card-image">
      <img src={props.imgURL} />
      <div className="overlay-title"><h2>{props.title}</h2></div>
    </div>
    <button onClick={() => navigate(`/product-category/${props.category_name}`)}/>
  </div>
  )
}

export default CardHomePage;