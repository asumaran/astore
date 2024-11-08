export function cartHasItems(cart) {
  return cart && Object.keys(cart).length > 0 && cart.items.length > 0;
}
