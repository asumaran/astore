import Currency from "./Currency";
import styles from "../app/page.module.scss";
import { AppContext } from "@/app/app-provider";
import { useContext } from "react";

async function removeItemFromCart(itemKey) {
  // probably a better idea to move this and get the token from the context or pass it as param.
  // to avoid having two sources of truth
  let cartToken = localStorage.getItem("cartToken");

  if (!cartToken) {
    console.error("No Cart Token found");
    return;
  }

  const response = await fetch(
    "https://wcpay.test/wp-json/wc/store/v1/cart/remove-item",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Cart-Token": cartToken,
      },
      body: JSON.stringify({ key: itemKey }),
    }
  );

  const cartTokenFromResponse = response.headers.get("Cart-Token");
  const cart = await response.json();

  return { cart, cartToken: cartTokenFromResponse };
}

export default function CartItem({ item }) {
  const { setCart, setCartToken } = useContext(AppContext);

  async function onRemoveItemClickHandler() {
    const { cart, cartToken: cartTokenFromResponse } = await removeItemFromCart(
      item.key
    );

    // Update cart and Cart Token
    setCart(cart);
    setCartToken(cartTokenFromResponse);
  }
  return (
    <div className={styles.cartItem}>
      <div className={styles.image}>
        <img alt="Product Image" width="30" src={item.images[0]?.src} />
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
      <div>
        <button onClick={onRemoveItemClickHandler}>Remove</button>
      </div>
    </div>
  );
}
