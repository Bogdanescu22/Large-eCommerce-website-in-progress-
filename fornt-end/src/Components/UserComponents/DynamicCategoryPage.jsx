import React, {useState, useEffect} from "react";
import { useParams } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import CardTelefoanePage from "./CardTelefoanePage";

const DynamicCategoryPage = () => {

const {category} = useParams();

const [categories, setCategories] = useState([])
const [product, setProduct] = useState([])


  useEffect(()=>{
  fetch("http://localhost:5000/category_pages")
  .then((res)=>res.json())
  .then((data)=>{setCategories(data) ;console.log("Asta e data:",data)})
  .catch((err)=>console.log("Eroare la fetch", err))
  },[])

  useEffect(()=>{
    fetch(`http://localhost:5000/search_product/${decodeURIComponent(category)}`)
    .then((res)=>res.json())
    .then((data)=>{setProduct(data) ;console.log("Asta e data:",data); console.log(category)})
    .catch((err)=>console.log("Eroare la fetch", err))
    },[])
  


return(

<div className="telefoane-container">
<Header />
<main>
<div className="hero-div-telefoanePage">
      <div className="hero-text-Telefoane"> {/* corectat className */}
      <h1 className="hero-title-Telefoane">Telefoane</h1>
      </div>
</div>
<div className="product-cards-div">
      {product.length>0 ? (product.map((produs) => (
        <CardTelefoanePage
          key={produs.id}
          productId={produs.id}
          imgURL={produs.image_url}
          name={produs.name}
          price={produs.price}
          category={produs.category}
        />
      ))) : (
      "Se incarca cards"
      )}
    </div>
</main>
<Footer />
</div>
);

}

export default DynamicCategoryPage