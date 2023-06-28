"use client";

import { createContext, useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";

async function getCart(cartToken) {
  const headers = {};

  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }

  const response = await fetch("http://wcpay.test/wp-json/wc/store/v1/cart", {
    headers,
  });

  const cartTokenFromResponse = response.headers.get("Cart-Token");
  const cart = await response.json();

  return { cart, cartToken: cartTokenFromResponse };
}

async function getProducts() {
  const response = await fetch(
    "http://wcpay.test/wp-json/wc/store/v1/products"
  );
  return await response.json();
}

async function addProductToCart(product, cartToken) {
  const response = await fetch(
    "http://wcpay.test/wp-json/wc/store/v1/cart/add-item",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
      },
      body: JSON.stringify({ id: product.id, quantity: 1 }),
    }
  );

  return await response.json();
}

const StoreContext = createContext(null);

function ProductItem(props) {
  const { product } = props;
  const { cartToken } = useContext(StoreContext);

  async function handleClick() {
    await addProductToCart(product, cartToken);
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
        {product.is_purchasable && (
          <button onClick={handleClick}>Add to Cart</button>
        )}
      </div>
    </div>
  );
}

function Main() {
  const { setCart, cartToken, setCartToken } = useContext(StoreContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();

    (async () => {
      const { cartToken } = await getCart();
      setCartToken(cartToken);
    })();

    return () => {};
  }, []);

  async function onClickGetCartHandler() {
    const { cart } = await getCart(cartToken);

    setCart(cart);
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
  const [cart, setCart] = useState({});
  const [cartToken, setCartToken] = useState(null);

  // we could memoize the value
  return (
    <StoreContext.Provider value={{ cart, setCart, cartToken, setCartToken }}>
      <Main />
    </StoreContext.Provider>
  );
}
