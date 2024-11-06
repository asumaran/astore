import CartItem from "./CartItem";
import Currency from "./Currency";
import styles from "../app/page.module.scss";

export default function CartBlock({ cart }) {
  return (
    <div>
      <h2>Cart</h2>
      {Object.keys(cart).length ? (
        <div>
          <ul className={styles.cart}>
            {cart.items?.map((item) => (
              <li key={item.key}>
                <CartItem item={item} />
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
    </div>
  );
}
