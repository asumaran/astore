'use client';

import { createContext, useEffect, useState } from 'react';

export const AppContext = createContext(null);

export async function getCart(cartToken) {
  const headers = {};

  if (cartToken) {
    headers['Cart-Token'] = cartToken;
  }

  const response = await fetch('https://wcpay.test/wp-json/wc/store/v1/cart', {
    headers,
  });

  const cartTokenFromResponse = response.headers.get('Cart-Token');
  const cart = await response.json();

  return { cart, cartToken: cartTokenFromResponse };
}

export default function AppProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartToken, setCartToken] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedCartToken = localStorage.getItem('cartToken');

    // if there's a token then get the cart.
    if (storedCartToken) {
      (async () => {
        const { cart, cartToken: cartTokenFromResponse } = await getCart(
          storedCartToken
        );
        setCart(cart);
        setCartToken(cartTokenFromResponse);
      })();
    }

    // get orders from localStorage
    const storedOrders = localStorage.getItem('orders');

    if (storedOrders) {
      const orders = JSON.parse(storedOrders);
      setOrders(orders);
    }

    return () => {};
  }, []);

  return (
    <AppContext.Provider
      value={{ cart, setCart, cartToken, setCartToken, orders, setOrders }}
    >
      {children}
    </AppContext.Provider>
  );
}
