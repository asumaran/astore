'use client';

import Debug from '@/components/Debug';
import { AppContext } from '../app-provider';
import { useContext } from 'react';
import Link from 'next/link';

export default function Orders({ children }) {
  const { orders } = useContext(AppContext);
  return (
    <div>
      <div>{children}</div>
    </div>
  );
}
