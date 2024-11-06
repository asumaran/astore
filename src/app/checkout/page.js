"use client";

import { useContext } from "react";
import { AppContext } from "../app-provider";
import CartBlock from "@/components/CartBlock";
import Navigation from "@/components/Navigation";
import Debug from "@/components/Debug";

async function getCheckoutData() {
  let cartToken = localStorage.getItem("cartToken");

  if (!cartToken) {
    console.error("No Cart Token found");
    return;
  }

  const response = await fetch(
    "https://wcpay.test/wp-json/wc/store/v1/checkout",
    {
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
      },
    }
  );

  const cartTokenFromResponse = response.headers.get("Cart-Token");
  const checkoutData = await response.json();

  return { checkoutData, cartToken: cartTokenFromResponse };
}

export default function Checkout() {
  const { cart, cartToken, setCartToken } = useContext(AppContext);

  async function getCheckoutDataOnClickHandler() {
    const { checkoutData, cartToken } = await getCheckoutData();

    console.log("Checkout Data", checkoutData);
    setCartToken(cartToken);
  }
  return (
    <div>
      <Navigation />
      <h1>Checkout Page</h1>
      <CartBlock cart={cart} />
      <hr />
      <p>
        <button onClick={getCheckoutDataOnClickHandler}>
          Get Checkout Data
        </button>
      </p>
      <hr />
      <Debug cartToken={cartToken} />
    </div>
  );
}
