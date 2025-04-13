import React, { useEffect, useState } from "react";
import Header from "../UserComponents/Header";
import Footer from "./Footer";
import CardHomePage from "./CardHomePage";
import cardsinfo from "./HomePageArray";
import { data } from "react-router";

// 🔁 Array cu imaginile de fundal (fără url() aici!)
const heroBackgrounds = [
  "https://www.ookla.com/s/media/2024/11/iPhone-16-5G-Performance-Header-2024.png",
  "https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/mls/ezu7nroj7ucmx78qe3su.jpg",
  "https://www.apple.com/newsroom/images/product/imac/standard/apple_new-imac-spring21_hero_04202021_Full-Bleed-Image.jpg.large.jpg"
];

//const [categories, setCategories] = useState(null)

//function CreateCard(info) {
  //return (
  //<div>
  //{categories.map((category)=>(
   //<CardHomePage
    //  key={category.id}
    // title={info.title}
    //  imgURL={info.imgURL}
     // buttonURL={info.buttonURL}
   // />))}
  //</div>
 // );
//}

function HomePage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);

  //useEffect(()=>{
  //fetch("http://localhost:5000/products/categories")
  //.then((res)=>res.json())
  //.then((data)=>setCategories(data))
  //.catch((err)=>console.log("Eroare la fetch", err))
  //},[])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length);
    }, 5000); // schimbă fundalul la fiecare 5 secunde

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="telefoaneHero-container">
      <Header />
      <main className="main-content">
        <div
          className="hero-div"
          style={{
            backgroundImage: `url(${heroBackgrounds[currentBgIndex]})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            transition: "background-image 1s ease-in-out"
          }}
        >
          <div className="hero-text">
            <h1 className="titleHomePageHero">Bun venit pe site-ul nostru</h1>
            <h2 className="subtitleHomePageHero">Descoperă cele mai bune oferte</h2>
          </div>
        </div>
        <div className="product-cards-div">
         
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
