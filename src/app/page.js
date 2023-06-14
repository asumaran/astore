"use client";

import { createContext, useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";

async function getCart() {
  const response = await fetch("http://wcpay.test/wp-json/wc/store/v1/cart");
  const nonce = response.headers.get("nonce");
  const cart = await response.json();
  return { nonce, cart };
}

async function getProducts() {
  const response = await fetch(
    "http://wcpay.test/wp-json/wc/store/v1/products",
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
}

async function addProductToCart(product, nonce) {
  const response = await fetch(
    "http://wcpay.test/wp-json/wc/store/v1/cart/add-item",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Nonce: nonce,
      },
      body: JSON.stringify({ id: product.id, quantity: 1 }),
    }
  );

  return await response.json();
}

const StoreContext = createContext(null);

function ProductItem(props) {
  const { product } = props;
  const { storeData } = useContext(StoreContext);

  async function handleClick() {
    await addProductToCart(product, storeData.nonce);
  }

  return (
    <div>
      <div>
        [{product.id}] - {product.name}
      </div>
      <div>
        <img width="100" src={product.images[0]?.src} />
      </div>
      <div>
        <button onClick={handleClick}>Add to Cart</button>
      </div>
    </div>
  );
}

function Main() {
  const { storeData, setStoreData } = useContext(StoreContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();

    return () => {};
  }, []);

  async function onClickGetCartHandler() {
    const { nonce, cart } = await getCart();

    const newStoreData = storeData;
    newStoreData.nonce = nonce;

    setStoreData(newStoreData);
  }

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
      <div>
        <button onClick={onClickGetCartHandler}>Get Cart</button>
      </div>
    </div>
  );
}

export default function Home() {
  const [storeData, setStoreData] = useState({});

  // we could memoize the value
  return (
    <StoreContext.Provider value={{ storeData, setStoreData }}>
      <Main />
    </StoreContext.Provider>
  );
}
