import React, {useEffect,useState} from "react";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import CardTelefoanePage from "./CardTelefoanePage.jsx";

function TelefoanePage () {

const[telefoane, setTelefoane]=useState([]);

useEffect(()=> {
fetch("https://api.devsite.cfd/telefoane-cards")
.then((res)=>res.json())
.then((data) => {
console.log("Datele primite:", data);  // Verifică structura datelor
setTelefoane(data);
})
.catch((err) => console.log("Eroare la fetch pt telefoane page",err))
},[]);

return (
<div className="telefoane-container">
<Header />
<main>
<div className="hero-div-telefoanePage">
      <div className="hero-text-Telefoane"> {/* corectat className */}
      <h1 className="hero-title-Telefoane">Telefoane</h1>
      </div>
</div>
<div className="product-cards-div">
      {telefoane.map((produs) => (
        <CardTelefoanePage
          key={produs.id}
          productId={produs.id}
          imgURL={produs.image_url}
          name={produs.name}
          price={produs.price}
          category={produs.category}
        />
      ))}
    </div>
</main>
<Footer />
</div>
);
}

export default TelefoanePage;