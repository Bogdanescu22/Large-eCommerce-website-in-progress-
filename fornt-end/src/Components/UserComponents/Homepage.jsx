import React, {useEffect, useState} from "react";
import Header from "../UserComponents/Header.jsx";
import Footer from "./Footer.jsx";
import CardHomePage from "./CardHomePage.jsx";
import cardsinfo from "./HomePageArray";


function CreateCard (info) {
  return (
  <CardHomePage
  key={info.id}
  title={info.title}
  imgURL={info.imgURL}
  buttonURL={info.buttonURL}
  />
  );
  }

function HomePage() {

const [bgIndex, setBgIndex]= useState(0);

const backgroundImagesHeroDiv = [
"https://www.ookla.com/s/media/2024/11/iPhone-16-5G-Performance-Header-2024.png",
"https://images.mlssoccer.com/image/private/t_editorial_landscape_8_desktop_mobile/mls/ezu7nroj7ucmx78qe3su.jpg",
"https://www.apple.com/newsroom/images/product/imac/standard/apple_new-imac-spring21_hero_04202021_Full-Bleed-Image.jpg.large.jpg"
]


useEffect(()=>{
const interval = setInterval (() => {setBgIndex((prevIndex)=>(prevIndex+1) % backgroundImagesHeroDiv.length)} , 5000);

return () => clearInterval(interval)

},[])

  return (
    <div className="telefoaneHero-container">
      <Header />
      <main className="main-content">
        <div className="hero-div"
        style={{
          background: `url(${backgroundImagesHeroDiv[bgIndex]})`,
          backgroundSize: "cover" ,
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
        {cardsinfo.map(CreateCard)}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
