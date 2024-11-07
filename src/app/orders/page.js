'use client';

import Debug from '@/components/Debug';
import Navigation from '@/components/Navigation';
import { AppContext } from '../app-provider';
import { useContext } from 'react';

export default function Orders() {
  const { orders } = useContext(AppContext);
  return (
    <div>
      <Navigation />
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key='order.orderId'>
            <div>
              <a href='#'>Order: #{order.orderId}</a>
            </div>
          </li>
        ))}
      </ul>
      <Debug />
    </div>
  );
}
