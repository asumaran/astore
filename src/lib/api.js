async function addProductToCart(productId) {
  let storedCartToken = localStorage.getItem('cartToken');

  if (!storedCartToken) {
    const { cartToken } = await getCart();
    // store Cart Token
    storedCartToken = cartToken;
    localStorage.setItem('cartToken', cartToken);
  }

  const response = await fetch(
    'https://wcpay.test/wp-json/wc/store/v1/cart/add-item',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cart-Token': storedCartToken,
      },
      body: JSON.stringify({ id: productId, quantity: 1 }),
    }
  );

  const cartTokenFromResponse = response.headers.get('Cart-Token');
  const cart = await response.json();

  return { cart, cartToken: cartTokenFromResponse };
}

async function getCart(cartToken) {
  const headers = {};

  if (cartToken) {
    headers['Cart-Token'] = cartToken;
  }

  const response = await fetch('https://wcpay.test/wp-json/wc/store/v1/cart', {
    headers,
  });

  const cartTokenFromResponse = response.headers.get('Cart-Token');
  const cart = await response.json();

  return { cart, cartToken: cartTokenFromResponse };
}

export { addProductToCart, getCart };
