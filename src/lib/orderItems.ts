interface CartOrderItem {
  productId: string;
  quantity: number;
}

interface OrderProduct {
  id: string;
  name: string;
  price: number;
  pricePerCustom: number | null;
  customPriceLabel: string | null;
  showSecondaryCartButton: boolean;
}

export function getBaseProductId(cartId: string) {
  if (cartId.endsWith("-custom")) return cartId.slice(0, -"-custom".length);
  if (cartId.endsWith("-standard")) return cartId.slice(0, -"-standard".length);
  return cartId;
}

export function resolveCartItem(item: CartOrderItem, product: OrderProduct) {
  if (item.productId.endsWith("-custom")) {
    if (!product.showSecondaryCartButton || !product.pricePerCustom || !product.customPriceLabel) {
      return null;
    }
    return {
      productId: product.id,
      productName: `${product.name} (${product.customPriceLabel})`,
      quantity: item.quantity,
      price: product.pricePerCustom,
    };
  }

  return {
    productId: product.id,
    productName: item.productId.endsWith("-standard")
      ? `${product.name} (Цена на брой)`
      : product.name,
    quantity: item.quantity,
    price: product.price,
  };
}
