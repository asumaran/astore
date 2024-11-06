import Currency from "./Currency";
import styles from "../app/page.module.scss";

export default function CartItem({ item }) {
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
    </div>
  );
}
