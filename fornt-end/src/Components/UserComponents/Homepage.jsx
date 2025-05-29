import React, { useEffect, useState } from "react";
import Header from "../UserComponents/Header";
import Footer from "./Footer";
import CardHomePage from "./CardHomePage";
import { Helmet } from "react-helmet";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom"; // <-- pentru limbă din URL

const heroBackgrounds = [
  "https://d20rvp9abs48mr.cloudfront.net/Images/iPhone-16-5G-Performance-Header-2024.webp",
  "https://d20rvp9abs48mr.cloudfront.net/Images/ezu7nroj7ucmx78qe3su.webp",
  "https://d20rvp9abs48mr.cloudfront.net/Images/apple_new-imac-spring21_hero_04202021_Full-Bleed-Image.jpg.large.webp",
];

function HomePage() {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [categories, setCategories] = useState([]);

  const { i18n, t } = useTranslation("homepage"); // folosim namespace-ul "homepage"
  const { lang } = useParams(); // extragem limba din URL: /ro, /en, /fr

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang, i18n]);

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
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="telefoaneHero-container">
      <Helmet>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />

        <link rel="alternate" hreflang="ro" href="https://devsite.cfd/ro" />
        <link rel="alternate" hreflang="en" href="https://devsite.cfd/en" />
        <link rel="alternate" hreflang="fr" href="https://devsite.cfd/fr" />
        <link rel="alternate" hreflang="x-default" href="https://devsite.cfd/en" />
      </Helmet>

      <Header />
      <main className="main-content">
        <div className="hero-div">
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
            <h1 className="titleHomePageHero">{t("welcome")}</h1>
            <h2 className="subtitleHomePageHero">{t("subtitle")}</h2>
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
            <p>{t("loading")}</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;
