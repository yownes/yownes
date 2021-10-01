/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: CartFragment
// ====================================================

export interface CartFragment_total {
  __typename: "CartTotal";
  amount: number | null;
  value: string | null;
  label: string | null;
}

export interface CartFragment_subtotals_products {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface CartFragment_subtotals_discounts {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface CartFragment_subtotals_shipping {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface CartFragment_subtotals {
  __typename: "CartSubtotals";
  products: CartFragment_subtotals_products | null;
  discounts: CartFragment_subtotals_discounts | null;
  shipping: CartFragment_subtotals_shipping | null;
}

export interface CartFragment_products_option {
  __typename: "CartProductOption";
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface CartFragment_products_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  price: string | null;
}

export interface CartFragment_products {
  __typename: "CartProduct";
  key: string | null;
  quantity: number | null;
  total: string | null;
  option: (CartFragment_products_option | null)[] | null;
  product: CartFragment_products_product | null;
}

export interface CartFragment_vouchers_added {
  __typename: "Voucher";
  id: string | null;
  name: string | null;
  code: string | null;
  reduction: string | null;
}

export interface CartFragment_vouchers {
  __typename: "Vouchers";
  allowed: boolean | null;
  added: (CartFragment_vouchers_added | null)[] | null;
}

export interface CartFragment {
  __typename: "Cart";
  id: string | null;
  total: CartFragment_total | null;
  subtotals: CartFragment_subtotals | null;
  products: (CartFragment_products | null)[] | null;
  vouchers: CartFragment_vouchers | null;
  deliveryOption: string | null;
}
