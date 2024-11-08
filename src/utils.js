export function cartHasItems(cart) {
  if (!cart) {
    return false;
  }
  return Object.keys(cart).length > 0 && cart.items.length > 0;
}
