/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CartOption } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddToCart
// ====================================================

export interface AddToCart_addToCart_total {
  __typename: "CartTotal";
  amount: number | null;
  value: string | null;
  label: string | null;
}

export interface AddToCart_addToCart_subtotals_products {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface AddToCart_addToCart_subtotals_discounts {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface AddToCart_addToCart_subtotals_shipping {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface AddToCart_addToCart_subtotals {
  __typename: "CartSubtotals";
  products: AddToCart_addToCart_subtotals_products | null;
  discounts: AddToCart_addToCart_subtotals_discounts | null;
  shipping: AddToCart_addToCart_subtotals_shipping | null;
}

export interface AddToCart_addToCart_products_option {
  __typename: "CartProductOption";
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface AddToCart_addToCart_products_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  price: string | null;
}

export interface AddToCart_addToCart_products {
  __typename: "CartProduct";
  key: string | null;
  quantity: number | null;
  total: string | null;
  option: (AddToCart_addToCart_products_option | null)[] | null;
  product: AddToCart_addToCart_products_product | null;
}

export interface AddToCart_addToCart_vouchers_added {
  __typename: "Voucher";
  id: string | null;
  name: string | null;
  code: string | null;
  reduction: string | null;
}

export interface AddToCart_addToCart_vouchers {
  __typename: "Vouchers";
  allowed: boolean | null;
  added: (AddToCart_addToCart_vouchers_added | null)[] | null;
}

export interface AddToCart_addToCart {
  __typename: "Cart";
  id: string | null;
  total: AddToCart_addToCart_total | null;
  subtotals: AddToCart_addToCart_subtotals | null;
  products: (AddToCart_addToCart_products | null)[] | null;
  vouchers: AddToCart_addToCart_vouchers | null;
  deliveryOption: string | null;
}

export interface AddToCart {
  addToCart: AddToCart_addToCart | null;
}

export interface AddToCartVariables {
  id?: string | null;
  quantity?: number | null;
  options?: (CartOption | null)[] | null;
}
