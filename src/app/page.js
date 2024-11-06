'use client';

import { useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';
import { AppContext, getCart } from './app-provider';
import CartBlock from '@/components/CartBlock';
import Navigation from '@/components/Navigation';
import Debug from '@/components/Debug';
import ProductItem from '@/components/ProductItem';

async function getProducts() {
  const response = await fetch(
    'https://wcpay.test/wp-json/wc/store/v1/products'
  );
  return await response.json();
}

async function addProductToCart(productId) {
  let storedCartToken = localStorage.getItem('cartToken');

  if (!storedCartToken) {
    const { cartToken } = await getCart();
    // store Cart Token
    storedCartToken = cartToken;
    localStorage.setItem('cartToken', cartToken);
  }

  const response = await fetch(
    'https://wcpay.test/wp-json/wc/store/v1/cart/add-item',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cart-Token': storedCartToken,
      },
      body: JSON.stringify({ id: productId, quantity: 1 }),
    }
  );

  const cartTokenFromResponse = response.headers.get('Cart-Token');
  const cart = await response.json();

  return { cart, cartToken: cartTokenFromResponse };
}

export default function Home() {
  const { cart, setCart, cartToken, setCartToken } = useContext(AppContext);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();
  }, []);

  async function addProductToCartHandler(productId) {
    const { cart, cartToken: cartTokenFromResponse } = await addProductToCart(
      productId,
      cartToken
    );

    // Update cart and Cart Token
    setCart(cart);
    setCartToken(cartTokenFromResponse);
  }

  return (
    <div>
      <Navigation />
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
      <CartBlock cart={cart} />
      <hr />
      <Debug cartToken={cartToken} />
    </div>
  );
}
