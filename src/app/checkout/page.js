"use client";

import { useContext } from "react";
import { AppContext } from "../app-provider";
import CartBlock from "@/components/CartBlock";
import Navigation from "@/components/Navigation";
import Debug from "@/components/Debug";

export default function Checkout() {
  const { cart, cartToken } = useContext(AppContext);
  return (
    <div>
      <Navigation />
      <h1>Checkout Page</h1>
      <CartBlock cart={cart} />
      <hr />
      <Debug cartToken={cartToken} />
    </div>
  );
}
