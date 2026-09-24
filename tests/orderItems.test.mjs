import assert from "node:assert/strict";
import test from "node:test";
import { getBaseProductId, resolveCartItem } from "../src/lib/orderItems.ts";

const product = {
  id: "product-123",
  name: "Гипсов панел",
  price: 5,
  pricePerCustom: 8,
  customPriceLabel: "по размер",
  showSecondaryCartButton: true,
};

test("both cart variants resolve to the same database product with their own prices", () => {
  const standardId = `${product.id}-standard`;
  const customId = `${product.id}-custom`;
  assert.equal(getBaseProductId(standardId), product.id);
  assert.equal(getBaseProductId(customId), product.id);
  assert.deepEqual(resolveCartItem({ productId: standardId, quantity: 2 }, product), {
    productId: product.id,
    productName: "Гипсов панел (Цена на брой)",
    quantity: 2,
    price: 5,
  });
  assert.deepEqual(resolveCartItem({ productId: customId, quantity: 1 }, product), {
    productId: product.id,
    productName: "Гипсов панел (по размер)",
    quantity: 1,
    price: 8,
  });
});

test("a removed custom variant cannot be ordered", () => {
  assert.equal(
    resolveCartItem({ productId: `${product.id}-custom`, quantity: 1 }, {
      ...product,
      showSecondaryCartButton: false,
    }),
    null
  );
});

test("products without variants retain their normal price", () => {
  assert.equal(getBaseProductId(product.id), product.id);
  assert.deepEqual(resolveCartItem({ productId: product.id, quantity: 3 }, product), {
    productId: product.id,
    productName: product.name,
    quantity: 3,
    price: 5,
  });
});
