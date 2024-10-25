"use client";

import { createContext, useContext, useEffect, useState } from "react";
import styles from "./page.module.scss";
import Link from "next/link";

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

async function addProductToCart(productId) {
  let storedCartToken = localStorage.getItem("cartToken");

  if (!storedCartToken) {
    const { cartToken } = await getCart();
    // store Cart Token
    storedCartToken = cartToken;
    localStorage.setItem("cartToken", cartToken);
  }

  const response = await fetch(
    "https://wcpay.test/wp-json/wc/store/v1/cart/add-item",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": storedCartToken,
      },
      body: JSON.stringify({ id: productId, quantity: 1 }),
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
  const { product, addProductToCart } = props;

  function handleClick() {
    addProductToCart(product.id);
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

    // if there's a token then get it.
    if (cartToken) {
      (async () => {
        const { cart, cartToken: cartTokenFromResponse } = await getCart(
          cartToken
        );
        setCart(cart);
        setCartToken(cartTokenFromResponse);
      })();
    }
    return () => {};
  }, [cartToken, setCart, setCartToken]);

  async function addProductToCartHandler(productId) {
    const { cart, cartToken: cartTokenFromResponse } = await addProductToCart(
      productId,
      cartToken
    );

    // guardar cart y cart token token
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
                <ProductItem
                  product={product}
                  addProductToCart={addProductToCartHandler}
                />
              </li>
            );
          })}
      </ul>
      <h1>Cart</h1>
      {Object.keys(cart).length ? (
        <div>
          <ul className={styles.cart}>
            {cart?.items?.map((item) => (
              <li key={item.key}>
                <CartItem item={item} addProductToCart={addProductToCart} />
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
        </div>
      ) : (
        "Empty Cart"
      )}

      <hr />
      <div>
        <Link href="/checkout">Go to Checkout</Link>
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
  const [cartToken, setCartToken] = useState(localStorage.getItem("cartToken"));

  // we could memoize the value
  return (
    <StoreContext.Provider value={{ cart, setCart, cartToken, setCartToken }}>
      <Main />
    </StoreContext.Provider>
  );
}
