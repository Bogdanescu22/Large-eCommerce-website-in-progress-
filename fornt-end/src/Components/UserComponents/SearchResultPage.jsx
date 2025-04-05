import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import SearchResultPageCard from "./SearchResultPageCard";
import { useParams } from "react-router";

const SearchResultPage = () => {
  const [searchedProduct, setSearchedProduct] = useState([]);
  const [userId, setUserId] = useState(null);
  const [cart, setCart] = useState([]);
  const { text } = useParams();
  const [brandOption, setBrandOption] = useState([]);
  const [initialProducts, setInitialProducts] = useState([]);
  const [priceRange, setPriceRange] = useState([]);
  const [brandSearch, setBrandSearch] = useState("");
  const [buttonClick, setButtonClick] = useState(false);
  const [filtersMenuClickPrice, setFiltersMenuClickPrice] = useState(false);
  const [filtersMenuClickBrand, setFiltersMenuClickBrand] = useState(false);
  const [orderByPrice, setOrderByPrice] = useState("");

  useEffect(() => {
    const getUserId = async () => {
      try {
        const response = await fetch("https://api.devsite.cfd/auth/user", {
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Eroare la obținerea utilizatorului");
        }
        const data = await response.json();
        setUserId(data.user.id);
      } catch (error) {
        console.error("Eroare:", error);
      }
    };
    getUserId();
  }, []);

  useEffect(() => {
    if (!text) {
      console.log("SearchText nu exista!");
      return;
    }

    fetch(`https://api.devsite.cfd/search-result/${text}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSearchedProduct(data);
        setInitialProducts(data);
        console.log("Datele primite din fetch-ul pt produse filtrate", data);
      })
      .catch((err) => console.log("Eroare la obtinerea produselor", err));
  }, [text]);

  useEffect(() => {
    let filteredProducts = initialProducts;
  
    if (brandOption.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        brandOption.includes(product.brand)
      );
    }
  
    if (priceRange.length > 0) {
      const minPrice = Math.min(
        ...priceRange.map((range) => parseInt(range.split("-")[0] || "0"))
      );
      const maxPrice = Math.max(
        ...priceRange.map((range) => parseInt(range.split("-")[1] || "99999"))
      );
      
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    if (orderByPrice === "pret_crescator") {
      filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (orderByPrice === "pret_descrescator") {
      filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }
  
    setSearchedProduct(filteredProducts);
  }, [brandOption, priceRange, initialProducts]);

  useEffect(() => {
   if (orderByPrice === "pret_crescator") {
      setSearchedProduct((prevProducts) =>
        [...prevProducts].sort((a, b) => a.price - b.price)
      );
    } else if (orderByPrice === "pret_descrescator") {
      setSearchedProduct((prevProducts) =>
        [...prevProducts].sort((a, b) => b.price - a.price)
      );
    }
  }, [orderByPrice] )

  const handleBrandChange = (event) => {
    const { value, checked } = event.target;
    setBrandOption((prevBrands) => {
      if (checked) {
        return [...prevBrands, value];
      } else {
        return prevBrands.filter((brand) => brand !== value);
      }
    });
  };

  const handleOrderByPrice = (event) => {
    setOrderByPrice(event.target.value);
  };

  const handleFilterPrice = (eventPrice) => {
    const { value, checked } = eventPrice.target;
    setPriceRange((prevPrice) => {
      if (checked) {
        return [...prevPrice, value];
      } else {
        return prevPrice.filter((price) => price !== value);
      }
    });
  };

  const BrandDiv = () => {
    const groupedByBrand = initialProducts.reduce((acc, item) => {
      if (!acc[item.brand]) {
        acc[item.brand] = [];
      }
      acc[item.brand].push(item);
      return acc;
    }, {});

    const filteredBrands = Object.keys(groupedByBrand).filter((brand) =>
      brand.toLowerCase().includes(brandSearch)
    );

    return filteredBrands.map((brand) => (
      <div key={brand}>
        <input
          type="checkbox"
          id={brand}
          value={brand}
          checked={brandOption.includes(brand)}
          onChange={handleBrandChange}
        />
        <label htmlFor={brand}>{brand}</label>
      </div>
    ));
  };

  const handleBrandSearchBar = (event) => {
    setBrandSearch(event.target.value.toLowerCase());
  };

  return (
    <div className="search-result-page">
      <Header />
      <main>
        <div className="search-result-page-h1-order-by-div">
          <div className="search-result-page-h1">
            <h1>Rezultate <span>({searchedProduct.length})</span>:</h1>
          </div>
          <div className="search-result-page-order-by">
            <label htmlFor="">Ordonează după:</label>
            <select onChange={handleOrderByPrice} value={orderByPrice} name="orderBy">
              <option value="">Selecteaza</option>
              <option value="pret_crescator">Pret crescator</option>
              <option value="pret_descrescator">Pret descrescator</option>
            </select>
          </div>
        </div>
        <div className="filters-button-div">
          <button onClick={() => setButtonClick(!buttonClick)} className="filters-button">Filtre</button>
        </div>
        <div className="search-result-page-filters-productCards-div">
          <div className={`search-result-page-filters-div ${buttonClick ? "active" : ""}`}>
            <div className="search-result-page-filters-card">
              <div className="brand-h1-incon-div">
                <div className="brand-h1-div">
                  <h3 onClick={() => setFiltersMenuClickBrand(!filtersMenuClickBrand)}>{buttonClick ? "Brand" : "Brand:"}</h3>
                </div>
                <div className="brand-icon-div">
                  {filtersMenuClickBrand ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 9l6 6 6-6" stroke="#afb1b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 15l6-6 6 6" stroke="#afb1b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <div className={`brand-div-options ${filtersMenuClickBrand ? "active" : ""}`}>
                <input onChange={handleBrandSearchBar} type="text" placeholder="Caută..." />
                <BrandDiv />
              </div>
            </div>
            <div className="search-result-page-filters-card">
              <div className="price">
                <h3 onClick={() => setFiltersMenuClickPrice(!filtersMenuClickPrice)}>Preț:</h3>
                <div className={`price-buttons-div ${filtersMenuClickPrice ? "active" : ""}`}>
                  <div>
                    <input onChange={(eventPrice) => handleFilterPrice(eventPrice)} value="100-500" type="checkbox" id="500-1000" />
                    <label htmlFor="100-500">100-500</label>
                  </div>
                  <div>
                    <input onChange={(eventPrice) => handleFilterPrice(eventPrice)} value="500-1000" type="checkbox" id="500-1000" />
                    <label htmlFor="500-1000">500-1000</label>
                  </div>
                  <div>
                    <input onChange={(eventPrice) => handleFilterPrice(eventPrice)} value="1000-2000" type="checkbox" id="1000-2000" />
                    <label htmlFor="1000-2000">1000-2000</label>
                  </div>
                  <div>
                    <input onChange={(eventPrice) => handleFilterPrice(eventPrice)} value="2000-99999" type="checkbox" id="Peste_2000" />
                    <label htmlFor="Peste_2000">Peste 2000</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="search-result-page-productCards-div">
            {searchedProduct.map((produs) => (
              <SearchResultPageCard
                key={produs.id}
                productId={produs.id}
                imgURL={produs.image_url}
                name={produs.name}
                price={produs.price}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SearchResultPage;
