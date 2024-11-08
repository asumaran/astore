'use client';

import { useContext } from 'react';
import { AppContext } from '../app-provider';
import CartBlock from '@/components/CartBlock';
import Navigation from '@/components/Navigation';
import Debug from '@/components/Debug';
import { useRouter } from 'next/navigation';
import { cartHasItems } from '@/utils';

async function doCheckout(formData) {
  let cartToken = localStorage.getItem('cartToken');

  if (!cartToken) {
    console.error('No Cart Token found');
    return;
  }

  const checkoutData = {
    billing_address: {
      email: formData.get('email'),
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

  async function onFormSubmit(e) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const { checkout } = await doCheckout(formData);

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
      {cartHasItems(cart) && (
        <form onSubmit={onFormSubmit}>
          <p>
            <label htmlFor='email'>Email</label>
            <input type='email' name='email' id='email' />
          </p>
          <p>Shipping Address</p>
          <p>
            <label htmlFor='shipping-country'>Country</label>
            <select
              name='shipping-country'
              id='shipping-country'
              autoComplete='country'
            >
              <option value='US'>United States</option>
              <option value='PE'>Perú</option>
            </select>
          </p>
          <p>
            <label htmlFor='shipping-first-name'>First Name</label>
            <input
              type='text'
              name='shipping-first-name'
              id='shipping-first-name'
              autoComplete='given-name'
            />
          </p>
          <p>
            <label htmlFor='shipping-last-name'>Last Name</label>
            <input
              type='text'
              name='shipping-last-name'
              id='shipping-last-name'
              autoComplete='family-name'
            />
          </p>
          <p>
            <label htmlFor='shipping-address-1'>Address</label>
            <input
              type='text'
              name='shipping-address-1'
              id='shipping-address-1'
              autoComplete='address-line1'
            />
          </p>
          <p>
            <label htmlFor='shipping-address-2'>Apartment, Suite, etc.</label>
            <input
              type='text'
              name='shipping-address-2'
              id='shipping-address-2'
              autoComplete='address-line2'
            />
          </p>
          <p>
            <label htmlFor='shipping-city'>City</label>
            <input
              type='text'
              name='shipping-city'
              id='shipping-city'
              autoComplete='address-level2'
            />
          </p>
          <p>
            <label htmlFor='shipping-state'>State</label>
            <input
              type='text'
              name='shipping-state'
              id='shipping-state'
              autoComplete='address-level1'
            />
          </p>
          <p>
            <label htmlFor='shipping-postcode'>ZIP Code</label>
            <input
              type='text'
              name='shipping-postcode'
              id='shipping-postcode'
            />
          </p>
          <p>
            <label htmlFor='phone'>Phone</label>
            <input type='tel' name='phone' id='phone' autoComplete='tel' />
          </p>
          <hr />
          <p>
            <button type='submit'>Checkout</button>
          </p>
          <hr />
        </form>
      )}
      <Debug />
    </div>
  );
}
