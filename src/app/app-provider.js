"use client";

import { createContext, useState } from "react";

export const AppContext = createContext(null);

export default function AppProvider({ children }) {
  const [cart, setCart] = useState({});
  const [cartToken, setCartToken] = useState(localStorage.getItem("cartToken"));

  return (
    <AppContext.Provider value={{ cart, setCart, cartToken, setCartToken }}>
      {children}
    </AppContext.Provider>
  );
}
