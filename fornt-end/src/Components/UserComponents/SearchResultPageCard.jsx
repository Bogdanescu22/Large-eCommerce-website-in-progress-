import React from "react";
import {useNavigate} from "react-router-dom"



const SearchResultPageCard = ({imgURL, name, price, handleButtonClick}) => {

const navigate= useNavigate();


return(
<div className="phone-card-SearchPage">
      {/* Înlocuim <Link to={...}> cu navigate() */}
      <img
        className="phone-card-image-SearchPage"
        src={imgURL}
        alt={name}
        onClick={() => navigate(`/products/${name}`)} // Navighează fără refresh
        style={{ cursor: "pointer" }} // Schimbăm cursorul la hover
      />
      <div className="title-search-div">
      <h2
        className="phone-card-title-searchPage"
        onClick={() => navigate(`/products/${name}`)}
        style={{ cursor: "pointer" }}
      >
        {name}
      </h2>
      </div>
      <h3 className="phone-card-price">${price}</h3>
      <button className="phone-card-button" onClick={handleButtonClick}>
        Adaugă în coș
      </button>
    </div>)
}
export default  SearchResultPageCard;