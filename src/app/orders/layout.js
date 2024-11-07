'use client';

import Debug from '@/components/Debug';
import Navigation from '@/components/Navigation';
import { useContext } from 'react';
import { AppContext } from '../app-provider';
import Link from 'next/link';

export default function OrdersLayout({ children }) {
  const { orders } = useContext(AppContext);

  return (
    <div>
      <Navigation />
      <h1>Orders</h1>
      <ul>
        {orders.map((order) => (
          <li key={order.orderId}>
            <Link href={'/orders/' + order.orderId}>
              Order #{order.orderId}
            </Link>
          </li>
        ))}
      </ul>
      <div>{children}</div>
      <Debug />
    </div>
  );
}
