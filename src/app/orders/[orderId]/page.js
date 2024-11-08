'use client';

import { AppContext } from '@/app/app-provider';
import { useContext, useEffect, useState } from 'react';

async function getOrderDetails(orderId, orderKey, email) {
  const urlParams = new URLSearchParams();
  urlParams.append('key', orderKey);
  urlParams.append('billing_email', email);

  const response = await fetch(
    'https://wcpay.test/wp-json/wc/store/v1/order/' +
      orderId +
      '?' +
      urlParams.toString(),
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return await response.json();
}

export default function OrderDetails({ params }) {
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    (async () => {
      const orderId = (await params).orderId;
      // findOrder
      const order = JSON.parse(localStorage.getItem('orders')).find((o) => {
        return o.orderId === Number(orderId);
      });
      const response = await getOrderDetails(
        orderId,
        order.orderKey,
        decodeURIComponent(order.email)
      );
      setOrderDetails(response);
    })();
  }, [params]);

  return (
    <div>
      <h1>Order details!</h1>
      <pre>{JSON.stringify(orderDetails, null, 2)}</pre>
    </div>
  );
}
