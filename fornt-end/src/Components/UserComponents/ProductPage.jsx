import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import ProductPageHtml from "./ProductPageHtml.jsx";

const ProductPage = () => {
  const { name } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (!name) return;

    fetch(`https://api.devsite.cfd/products/${name}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Datele primite:", data);
        setProduct(data);
      })
      .catch((err) => console.log("Eroare la obtinerea datelor produsului", err));
  }, [name]);

  if (!product) {
    return <h2>Se încarcă produsul...</h2>;
  }

  return (
    <ProductPageHtml
      key={product.id}
      name_product={product.name}
      image_product={product.image_url}
      stock_product={product.stock}
      product_price={product.price}
      product_details={product.product_details}
      product_id={product.id}
    />
  );
};

export default ProductPage;