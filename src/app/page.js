"use client";

import { createContext, useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";

async function getCart(cartToken) {
  const headers = {};

  if (cartToken) {
    headers["Cart-Token"] = cartToken;
  }

  const response = await fetch("https://wcpay.test/wp-json/wc/store/v1/cart", {
    headers,
  });

  const cartTokenFromResponse = response.headers.get("Cart-Token");
  const cart = await response.json();

  return { cart, cartToken: cartTokenFromResponse };
}

async function getProducts() {
  const response = await fetch(
    "https://wcpay.test/wp-json/wc/store/v1/products"
  );
  return await response.json();
}

async function addProductToCart(product, cartToken) {
  const response = await fetch(
    "https://wcpay.test/wp-json/wc/store/v1/cart/add-item",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
      },
      body: JSON.stringify({ id: product.id, quantity: 1 }),
    }
  );

  const cartTokenFromResponse = response.headers.get("Cart-Token");
  const cart = await response.json();

  return { cart, cartToken: cartTokenFromResponse };
}

function Currency({ amount, code = "USD" }) {
  const formatter = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    maximumFractionDigits: 2,
  });
  return <span>{formatter.format(amount / 100)}</span>;
}

const StoreContext = createContext(null);

function ProductItem(props) {
  const { product } = props;
  const { setCart, cartToken, setCartToken } = useContext(StoreContext);

  async function handleClick() {
    const { cart, cartToken: cartTokenFromResponse } = await addProductToCart(
      product,
      cartToken
    );

    setCart(cart);
    setCartToken(cartTokenFromResponse);
  }

  return (
    <div className={styles.product}>
      <div className={styles.id}>{product.id}</div>
      <div className={styles.details}>
        <div className={styles.content}>
          <div>
            <img width="100" src={product.images[0]?.src} />
          </div>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.price}>
            <Currency amount={product.prices.price} />
          </div>
        </div>
        {product.is_purchasable && (
          <div className={styles.addToCart}>
            <button onClick={handleClick}>Add to Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItem({ item }) {
  return (
    <div className={styles.cartItem}>
      <div className={styles.image}>
        <img width="30" src={item.images[0]?.src} />
      </div>
      <div className={styles.id}>ID: {item.id}</div>
      <div className={styles.name}>{item.name}</div>
      <div className={styles.qty}>x{item.quantity}</div>
      <div className={styles.price}>
        <Currency amount={item.prices.price} />
      </div>
      <div className={styles.salePrice}>
        <Currency amount={item.prices.sale_price} />
      </div>
      <div className={styles.lineSubTotal}>
        <Currency amount={item.totals.line_subtotal} />
      </div>
      <div className={styles.lineTotal}>
        <Currency amount={item.totals.line_total} />
      </div>
    </div>
  );
}

function Main() {
  const { cart, setCart, cartToken, setCartToken } = useContext(StoreContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();

    (async () => {
      const { cartToken, cart } = await getCart();
      setCart(cart);
      setCartToken(cartToken);
    })();

    return () => {};
  }, []);

  async function onClickGetCartHandler() {
    const { cart, cartToken: cartTokenFromResponse } = await getCart(cartToken);

    setCart(cart);
    setCartToken(cartTokenFromResponse);
  }

  return (
    <div>
      <h1>Products</h1>
      <ul className={styles.products}>
        {products
          .filter((i) => i.is_purchasable)
          .map((product) => {
            return (
              <li key={product.id}>
                <ProductItem product={product} />
              </li>
            );
          })}
      </ul>
      <h1>Cart</h1>
      <ul className={styles.cart}>
        {cart?.items?.map((item) => (
          <li key={item.key}>
            <CartItem item={item} />
          </li>
        ))}
      </ul>
      <div className="totals">
        <h2>Totals</h2>
        <div>
          Total items: <Currency amount={cart.totals?.total_items} />
        </div>
        <div>
          Total Shipping: <Currency amount={cart.totals?.total_shipping} />
        </div>
        <div>
          Total price: <Currency amount={cart.totals?.total_price} />
        </div>
        <div>
          <button>Order now</button>
        </div>
      </div>
      <hr />
      <div>
        <button onClick={onClickGetCartHandler}>Get Cart</button>
      </div>
      <hr />
      <code>
        Debug: <br />
        Cart Token: {cartToken}
      </code>
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
