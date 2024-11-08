'use client';

import { useContext } from 'react';
import { AppContext } from '../app-provider';
import CartBlock from '@/components/CartBlock';
import Navigation from '@/components/Navigation';
import Debug from '@/components/Debug';
import { useRouter } from 'next/navigation';
import { cartHasItems } from '@/utils';

async function doCheckout() {
  let cartToken = localStorage.getItem('cartToken');

  if (!cartToken) {
    console.error('No Cart Token found');
    return;
  }

  const checkoutData = {
    billing_address: {
      email: 'asumaran@mail.test',
      first_name: 'Peter',
      last_name: 'Venkman',
      address_1: '550 Central Park West',
      city: 'New York',
      state: 'NY',
      postcode: '10023',
      country: 'US',
    },
    payment_method: 'cod',
  };

  const response = await fetch(
    'https://wcpay.test/wp-json/wc/store/v1/checkout',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cart-Token': cartToken,
      },
      body: JSON.stringify(checkoutData),
    }
  );

  const cartTokenFromResponse = response.headers.get('Cart-Token');
  const checkoutResponse = await response.json();

  return { checkout: checkoutResponse, cartToken: cartTokenFromResponse };
}

/**
 * Store order required params in the browser using localStorage.
 */
function storeOrderParams(orderId, orderKey, email) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  orders.unshift({ orderId, orderKey, email });

  localStorage.setItem('orders', JSON.stringify(orders));

  return orders;
}

export default function Checkout() {
  const { cart, setCart, setCartToken, setOrders } = useContext(AppContext);
  const router = useRouter();

  async function onCheckoutClickHandler() {
    const { checkout } = await doCheckout();

    const orders = storeOrderParams(
      checkout.order_id,
      checkout.order_key,
      checkout.billing_address.email
    );

    setOrders(orders);
    setCart(null);
    setCartToken(null);
    router.push('/');
  }

  return (
    <div>
      <Navigation />
      <h1>Checkout Page</h1>
      <CartBlock cart={cart} />
      <hr />
      {cartHasItems(cart) && (
        <>
          <p>
            <button onClick={onCheckoutClickHandler}>Checkout</button>
          </p>
          <hr />
        </>
      )}
      <Debug />
    </div>
  );
}
