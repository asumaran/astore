import { addProductToCart } from '@/lib/api';
import { useEffect, useContext } from 'react';
import { AppContext } from '@/app/app-provider';

const useAddProductToCart = () => {
  const { setCart, cartToken, setCartToken } = useContext(AppContext);

  const addProduct = async (productId) => {
    const { cart, cartToken: cartTokenFromResponse } = await addProductToCart(
      productId,
      cartToken
    );

    // Update cart and Cart Token
    setCart(cart);
    setCartToken(cartTokenFromResponse);
  };

  return { addProduct };
};

export default useAddProductToCart;
