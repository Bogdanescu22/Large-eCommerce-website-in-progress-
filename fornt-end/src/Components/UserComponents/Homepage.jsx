import React from "react";
import Header from "../UserComponents/Header";
import Footer from "./Footer";
import CardHomePage from "./CardHomePage";
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

  return (
    <div className="telefoaneHero-container">
      <Header />
      <main className="main-content">
        <div className="hero-div">
          <div className="hero-text"> {/* corectat className */}
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
