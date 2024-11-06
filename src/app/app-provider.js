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
  const [cart, setCart] = useState({});
  const [cartToken, setCartToken] = useState(null);

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
    return () => {};
  }, []);

  return (
    <AppContext.Provider value={{ cart, setCart, cartToken, setCartToken }}>
      {children}
    </AppContext.Provider>
  );
}
