"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.scss";

async function getProducts() {
  const response = await fetch(
    "http://wcpay.test/wp-json/wc/store/v1/products"
  );
  return await response.json();
}

function ProductItem(props) {
  const { product } = props;

  function handleClick() {
    console.log("add to cart");
  }

  return (
    <div>
      <div>{product.name}</div>
      <div>
        <img width="100" src={product.images[0]?.src} />
      </div>
      <div>
        <button onClick={handleClick}>Add to Cart</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();

    return () => {};
  }, []);

  return (
    <div>
      <h1>Products</h1>
      <ul className={styles.products}>
        {products.map((product) => {
          return (
            <li key={product.id}>
              <ProductItem product={product} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
