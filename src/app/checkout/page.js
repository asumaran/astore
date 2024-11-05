"use client";

import { useContext } from "react";
import { AppContext } from "../app-provider";

export default function Checkout() {
  const { cart, cartToken } = useContext(AppContext);
  return (
    <div>
      <h1>Checkout Pagex</h1>
      <code>
        Debug: <br />
        Cart Token: {cartToken}
      </code>
    </div>
  );
}
