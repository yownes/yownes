/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Cart
// ====================================================

export interface Cart_cart_total {
  __typename: "CartTotal";
  amount: number | null;
  value: string | null;
  label: string | null;
}

export interface Cart_cart_subtotals_products {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface Cart_cart_subtotals_discounts {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface Cart_cart_subtotals_shipping {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface Cart_cart_subtotals {
  __typename: "CartSubtotals";
  products: Cart_cart_subtotals_products | null;
  discounts: Cart_cart_subtotals_discounts | null;
  shipping: Cart_cart_subtotals_shipping | null;
}

export interface Cart_cart_products_option {
  __typename: "CartProductOption";
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface Cart_cart_products_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  price: string | null;
}

export interface Cart_cart_products {
  __typename: "CartProduct";
  key: string | null;
  quantity: number | null;
  total: string | null;
  option: (Cart_cart_products_option | null)[] | null;
  product: Cart_cart_products_product | null;
}

export interface Cart_cart_vouchers_added {
  __typename: "Voucher";
  id: string | null;
  name: string | null;
  code: string | null;
  reduction: string | null;
}

export interface Cart_cart_vouchers {
  __typename: "Vouchers";
  allowed: boolean | null;
  added: (Cart_cart_vouchers_added | null)[] | null;
}

export interface Cart_cart {
  __typename: "Cart";
  id: string | null;
  total: Cart_cart_total | null;
  subtotals: Cart_cart_subtotals | null;
  products: (Cart_cart_products | null)[] | null;
  vouchers: Cart_cart_vouchers | null;
  deliveryOption: string | null;
}

export interface Cart {
  cart: Cart_cart | null;
}
