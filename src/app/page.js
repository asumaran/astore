'use client';

import { useContext, useEffect, useState } from 'react';
import styles from './page.module.scss';
import { AppContext, getCart } from './app-provider';
import CartBlock from '@/components/CartBlock';
import Navigation from '@/components/Navigation';
import Debug from '@/components/Debug';
import ProductItem from '@/components/ProductItem';
import { useRouter } from 'next/navigation';
import { cartHasItems } from '@/utils';

async function getProducts() {
  const response = await fetch(
    'https://wcpay.test/wp-json/wc/store/v1/products'
  );
  return await response.json();
}

export default function Home() {
  const { cart } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const data = await getProducts();
      setProducts(data);
    })();
  }, []);

  function goToCheckoutClickHandler() {
    router.push('/checkout');
  }

  return (
    <div>
      <Navigation />
      <h1>Products</h1>
      <ul className={styles.products}>
        {products
          .filter((i) => i.is_purchasable)
          .map((product) => {
            return (
              <li key={product.id}>
                <ProductItem product={product} />
              </li>
            );
          })}
      </ul>
      <CartBlock cart={cart} />
      {cartHasItems(cart) && (
        <p>
          <button onClick={goToCheckoutClickHandler}>Go to Checkout</button>
        </p>
      )}
      <hr />
      <Debug />
    </div>
  );
}
