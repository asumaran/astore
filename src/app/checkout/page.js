"use client";

import { useContext } from "react";
import { AppContext } from "../app-provider";
import CartBlock from "@/components/CartBlock";

export default function Checkout() {
  const { cart, cartToken } = useContext(AppContext);
  return (
    <div>
      <h1>Checkout Page</h1>
      <CartBlock cart={cart} />
      <hr />
      <code>
        Debug: <br />
        Cart Token: {cartToken}
      </code>
    </div>
  );
}
