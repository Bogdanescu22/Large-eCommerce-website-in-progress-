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
  .then((data) => {
    const filtered = data.filter((cat) => cat.category_name === decodeURIComponent(category));
    console.log("Filtered",filtered)
    setCategories(filtered);
  })
  .catch((err)=>console.log("Eroare la fetch", err))
  },[])

  useEffect(()=>{
    fetch(`http://localhost:5000/search_product/${decodeURIComponent(category)}`)
    .then((res)=>res.json())
    .then((data)=>{setProduct(data) ;console.log("Asta e data:",data); console.log(category)})
    .catch((err)=>console.log("Eroare la fetch", err))
    },[])
  
    console.log("URL-ul imaginii:", `http://localhost:3000${categories[0]?.image.replace(/ /g, "%20")}`)

return(

<div className="telefoane-container">
<Header />
<main>
{categories.length > 0 ? (
  <div
    className="hero-div-telefoanePage"
    style={{
      backgroundImage: `url("http://localhost:3000${categories[0]?.image.replace(/ /g, "%20")}")`,
    }}
  >
    <div className="hero-text-Telefoane">
      <h1 className="hero-title-Telefoane">{categories[0]?.page_title}</h1>
    </div>
  </div>
) : (
  <div className="hero-div-telefoanePage">Se încarcă...</div>
)}

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