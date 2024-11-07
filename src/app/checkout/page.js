'use client';

import { useContext } from 'react';
import { AppContext } from '../app-provider';
import CartBlock from '@/components/CartBlock';
import Navigation from '@/components/Navigation';
import Debug from '@/components/Debug';

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

async function getCheckoutData() {
  let cartToken = localStorage.getItem('cartToken');

  if (!cartToken) {
    console.error('No Cart Token found');
    return;
  }

  const response = await fetch(
    'https://wcpay.test/wp-json/wc/store/v1/checkout',
    {
      headers: {
        'Content-Type': 'application/json',
        'Cart-Token': cartToken,
      },
    }
  );

  const cartTokenFromResponse = response.headers.get('Cart-Token');
  const checkoutData = await response.json();

  return { checkoutData, cartToken: cartTokenFromResponse };
}

/**
 * Store order required params in the browser using localStorage.
 */
function storeOrderParams(orderId, orderKey, email) {
  const orders = JSON.parse(localStorage.getItem('orders')) || [];

  orders.push({ orderId, orderKey, email });

  localStorage.setItem('orders', JSON.stringify(orders));
}

export default function Checkout() {
  const { cart, cartToken, setCartToken } = useContext(AppContext);

  async function onCheckoutClickHandler() {
    const { checkout, cartToken } = await doCheckout();

    // TODO: Do we need to set the cart token anymore after checkout?
    setCartToken(cartToken);

    storeOrderParams(
      checkout.order_id,
      checkout.order_key,
      checkout.billing_address.email
    );

    // TODO: Clear cart?
    // TODO: Redirect to home page?
  }

  async function getCheckoutDataOnClickHandler() {
    const { checkoutData, cartToken } = await getCheckoutData();

    console.log('Checkout Data', checkoutData);
    setCartToken(cartToken);
  }

  return (
    <div>
      <Navigation />
      <h1>Checkout Page</h1>
      <CartBlock cart={cart} />
      <hr />
      <p>
        <button onClick={onCheckoutClickHandler}>Checkout</button>
      </p>
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
