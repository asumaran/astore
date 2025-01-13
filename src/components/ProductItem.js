import Image from 'next/image';
import styles from '../app/page.module.scss';
import Currency from '@/components/Currency';

export default function ProductItem({ product, addProductToCart }) {
  function handleClick() {
    addProductToCart(product.id);
  }

  return (
    <div className={styles.product}>
      <div className={styles.id}>{product.id}</div>
      <div className={styles.details}>
        <div className={styles.content}>
          <div>
            {product.images[0]?.src ? (
              <img
                alt='Product Image'
                width='100'
                src={product.images[0]?.src}
              />
            ) : (
              <Image
                src='/product-placeholder.png'
                alt='Product image'
                width={100}
                height={100}
              />
            )}
          </div>
          <div className={styles.name}>{product.name}</div>
          <div className={styles.price}>
            <Currency amount={product.prices.price} />
          </div>
        </div>
        {product.is_purchasable && (
          <div className={styles.addToCart}>
            <button onClick={handleClick}>Add to Cart</button>
          </div>
        )}
      </div>
    </div>
  );
}
