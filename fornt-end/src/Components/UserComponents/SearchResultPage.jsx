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
  const [searchedProductByPrice, setSearchedProductByPrice] = useState([]);
  const [brandSearch, setBrandSearch] = useState(""); 
  const [buttonClick, setButtonClick] = useState(false);
  const [filtersMenuClickPrice, setFiltersMenuClickPrice] =useState(false);
  const [filtersMenuClickBrand, setFiltersMenuClickBrand] =useState(false);

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

    console.log("Asta e searchTextul:", text);

    fetch(`https://api.devsite.cfd/search-result/${text}`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setSearchedProduct(data);
        setInitialProducts(data);
        console.log("Datele primite din fetch-ul pt produse filtrate", data);
      })
      .catch((err) => console.log("Eroare la obtinerea produselor", err));
  }, [text]);

  const handleBrandChange = (event) => {
    const { value, checked } = event.target;
    setBrandOption((prevBrands) => {
      if (checked) {
        return [...prevBrands, value];
      } else {
        return prevBrands.filter((brand) => brand !== value);
      }
    });
    console.log(brandOption);
  };

  useEffect(() => {
    let filteredProducts = initialProducts;

    if (brandOption.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        brandOption.includes(product.brand)
      );
    }

    if (priceRange.length > 0) { 
      let tempProducts = [];

      if (priceRange.includes("500-1000")) {
        tempProducts = [...tempProducts, ...filteredProducts.filter(
          (product) => product.price >= 500 && product.price <= 1000
        )];
      }
      if (priceRange.includes("1000-2000")) {
        tempProducts = [...tempProducts, ...filteredProducts.filter(
          (product) => product.price >= 1000 && product.price <= 2000
        )];
      }
      if (priceRange.includes("Peste_2000")) {
        tempProducts = [...tempProducts, ...filteredProducts.filter(
          (product) => product.price > 2000
        )];
      }

      filteredProducts = tempProducts.length > 0 ? tempProducts : filteredProducts;
    }

    setSearchedProduct(filteredProducts);
  }, [brandOption, priceRange, initialProducts]);

  const BrandDiv = () => {
    const groupedByBrand = initialProducts.reduce((acc, item) => {
      if (!acc[item.brand]) {
        acc[item.brand] = [];
      }
      acc[item.brand].push(item);
      return acc;
    }, {});

    if (Object.keys(groupedByBrand).some((brand) => brand.toLowerCase() === brandSearch.toLowerCase())) {
      console.log("merge ba");
      return Object.keys(groupedByBrand)
        .filter((brand) => brand.toLowerCase().includes(brandSearch)) 
        .map((brand) => (
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
    } else {
      console.log("Nu merge", brandSearch);
      return Object.keys(groupedByBrand).map((brandName) => (
        <div key={brandName}>
          <input
            type="checkbox"
            id={brandName}
            value={brandName}
            checked={brandOption.includes(brandName)}
            onChange={handleBrandChange}
          />
          <label htmlFor={brandName}>{brandName}</label>
        </div>
      ));
    }
  };

  const handleBrandSearchBar = (event) => {
    setBrandSearch(event.target.value.toLowerCase());
  };

  console.log("Asta e brandSearch:", brandSearch);

 console.log(buttonClick)

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
            <select name="orderBy">
              <option value="">Selecteaza</option>
              <option value="pret_crescator">Pret crescator</option>
              <option value="pret_descrescator">Pret descrescator</option>
            </select>
          </div>
        </div>
        <div className="filters-button-div">
            <button onClick={()=>setButtonClick(!buttonClick)} className="filters-button">Filtre</button>
        </div>
        <div className="search-result-page-filters-productCards-div">
          <div className={`search-result-page-filters-div ${buttonClick? "active" : ""}`}>
            <div className="search-result-page-filters-card">
              <div  className="brand-h1-incon-div">
              <div className="brand-h1-div">
              <h3 onClick={()=>setFiltersMenuClickBrand(!filtersMenuClickBrand)}>{buttonClick? "Brand":"Brand:"}</h3>
              </div>
              <div className="brand-icon-div">
              {filtersMenuClickBrand? <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="#afb1b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>  : <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
             <path d="M6 15l6-6 6 6" stroke="#afb1b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
             </svg>}
              </div>
              </div>
              <div className={`brand-div-options ${filtersMenuClickBrand? "active" : ""}`}>
              <input onChange={handleBrandSearchBar} type="text" placeholder="Caută..." />
              <BrandDiv />
              </div>
            </div>
            <div className="search-result-page-filters-card ">
              <div className="price">
              <h3 onClick={()=>setFiltersMenuClickPrice(!filtersMenuClickPrice)}>Preț:</h3>

              <div className={`price-buttons-div ${filtersMenuClickPrice? "active" : ""}`}>
              <div>
              <input onChange={(eventPrice) => setPriceRange(eventPrice.target.value)} value="500-1000" type="checkbox" id="500-1000" />
              <label htmlFor="500-1000">500-1000</label>
              </div> 

              <div>
              <input onChange={(eventPrice) => setPriceRange(eventPrice.target.value)} value="1000-2000" type="checkbox" id="1000-2000" />
              <label htmlFor="1000-2000">1000-2000</label>
              </div>

              <div>
              <input onChange={(eventPrice) => setPriceRange(eventPrice.target.value)} value="Peste_2000" type="checkbox" id="Peste_2000" />
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


