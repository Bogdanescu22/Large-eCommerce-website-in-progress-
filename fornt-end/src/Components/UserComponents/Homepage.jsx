import React, { useEffect, useState } from "react";
import Header from "../UserComponents/Header";
import Footer from "./Footer";
import CardHomePage from "./CardHomePage";
import { Helmet } from 'react-helmet';


const heroBackgrounds = [
  "https://d20rvp9abs48mr.cloudfront.net/Images/iPhone-16-5G-Performance-Header-2024.webp",
  "https://d20rvp9abs48mr.cloudfront.net/Images/ezu7nroj7ucmx78qe3su.webp",
  "https://d20rvp9abs48mr.cloudfront.net/Images/apple_new-imac-spring21_hero_04202021_Full-Bleed-Image.jpg.large.webp"
];

function HomePage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("https://api.devsite.cfd/category_pages")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        console.log("Asta e data:", data);
      })
      .catch((err) => console.log("Eroare la fetch", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % heroBackgrounds.length);
    }, 5000); // schimbă fundalul la fiecare 5 secunde

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="telefoaneHero-container">

     <Helmet>
      <title>DevSite - Cel mai bun magazin online pentru electronice, haine și accesorii</title>
      <meta
        name="description"
        content="Descoperă produse de calitate la prețuri excelente. Livrare rapidă, oferte speciale și o experiență de cumpărare simplă și sigură pe DevSite."
      />
    </Helmet>

      <Header />
      <main className="main-content">
        <div className="hero-div">
          {/* Imaginea ca fundal */}
          <img
            src={heroBackgrounds[currentBgIndex]}
            alt="Hero"
            className="hero-img"
            loading="eager"
            fetchpriority="high"
            width="1920"
            height="800"
          />
          <div className="hero-text">
            <h1 className="titleHomePageHero">Bun venit pe site-ul nostru</h1>
            <h2 className="subtitleHomePageHero">Descoperă cele mai bune oferte</h2>
          </div>
        </div>
        <div className="product-cards-div">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CardHomePage
                key={category.id}
                title={category.page_title}
                imgURL={category.image}
                category_name={category.category_name}
              />
            ))
          ) : (
            <p>Se încarcă cards...</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
