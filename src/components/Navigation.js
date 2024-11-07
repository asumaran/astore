import Link from 'next/link';

export default function Navigation() {
  return (
    <nav>
      <ul>
        <li>
          <Link href='/'>Home</Link>
        </li>
        <li>
          <Link href='/checkout'>Checkout</Link>
        </li>
        <li>
          <Link href='/orders'>Orders</Link>
        </li>
      </ul>
    </nav>
  );
}
