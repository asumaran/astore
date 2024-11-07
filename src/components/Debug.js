import { AppContext } from '@/app/app-provider';
import { useContext } from 'react';

export default function Debug() {
  const { cart, cartToken } = useContext(AppContext);

  return (
    <div>
      Debug <br />
      <pre>
        Cart Token: {cartToken ? cartToken : 'No Cart Token'}
        <br />
        Cart: {cart ? JSON.stringify(cart, null, 2) : 'No Cart'}
      </pre>
    </div>
  );
}
