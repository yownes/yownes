/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveFromCart
// ====================================================

export interface RemoveFromCart_removeCart_total {
  __typename: "CartTotal";
  amount: number | null;
  value: string | null;
  label: string | null;
}

export interface RemoveFromCart_removeCart_subtotals_products {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface RemoveFromCart_removeCart_subtotals_discounts {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface RemoveFromCart_removeCart_subtotals_shipping {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface RemoveFromCart_removeCart_subtotals {
  __typename: "CartSubtotals";
  products: RemoveFromCart_removeCart_subtotals_products | null;
  discounts: RemoveFromCart_removeCart_subtotals_discounts | null;
  shipping: RemoveFromCart_removeCart_subtotals_shipping | null;
}

export interface RemoveFromCart_removeCart_products_option {
  __typename: "CartProductOption";
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface RemoveFromCart_removeCart_products_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  price: string | null;
}

export interface RemoveFromCart_removeCart_products {
  __typename: "CartProduct";
  key: string | null;
  quantity: number | null;
  total: string | null;
  option: (RemoveFromCart_removeCart_products_option | null)[] | null;
  product: RemoveFromCart_removeCart_products_product | null;
}

export interface RemoveFromCart_removeCart_vouchers_added {
  __typename: "Voucher";
  id: string | null;
  name: string | null;
  code: string | null;
  reduction: string | null;
}

export interface RemoveFromCart_removeCart_vouchers {
  __typename: "Vouchers";
  allowed: boolean | null;
  added: (RemoveFromCart_removeCart_vouchers_added | null)[] | null;
}

export interface RemoveFromCart_removeCart {
  __typename: "Cart";
  id: string | null;
  total: RemoveFromCart_removeCart_total | null;
  subtotals: RemoveFromCart_removeCart_subtotals | null;
  products: (RemoveFromCart_removeCart_products | null)[] | null;
  vouchers: RemoveFromCart_removeCart_vouchers | null;
  deliveryOption: string | null;
}

export interface RemoveFromCart {
  removeCart: RemoveFromCart_removeCart | null;
}

export interface RemoveFromCartVariables {
  key?: string | null;
}
