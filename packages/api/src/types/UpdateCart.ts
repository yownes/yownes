/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateCart
// ====================================================

export interface UpdateCart_updateCart_total {
  __typename: "CartTotal";
  amount: number | null;
  value: string | null;
  label: string | null;
}

export interface UpdateCart_updateCart_subtotals_products {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface UpdateCart_updateCart_subtotals_discounts {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface UpdateCart_updateCart_subtotals_shipping {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface UpdateCart_updateCart_subtotals {
  __typename: "CartSubtotals";
  products: UpdateCart_updateCart_subtotals_products | null;
  discounts: UpdateCart_updateCart_subtotals_discounts | null;
  shipping: UpdateCart_updateCart_subtotals_shipping | null;
}

export interface UpdateCart_updateCart_products_option {
  __typename: "CartProductOption";
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface UpdateCart_updateCart_products_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  price: string | null;
}

export interface UpdateCart_updateCart_products {
  __typename: "CartProduct";
  key: string | null;
  quantity: number | null;
  total: string | null;
  option: (UpdateCart_updateCart_products_option | null)[] | null;
  product: UpdateCart_updateCart_products_product | null;
}

export interface UpdateCart_updateCart_vouchers_added {
  __typename: "Voucher";
  id: string | null;
  name: string | null;
  code: string | null;
  reduction: string | null;
}

export interface UpdateCart_updateCart_vouchers {
  __typename: "Vouchers";
  allowed: boolean | null;
  added: (UpdateCart_updateCart_vouchers_added | null)[] | null;
}

export interface UpdateCart_updateCart {
  __typename: "Cart";
  id: string | null;
  total: UpdateCart_updateCart_total | null;
  subtotals: UpdateCart_updateCart_subtotals | null;
  products: (UpdateCart_updateCart_products | null)[] | null;
  vouchers: UpdateCart_updateCart_vouchers | null;
  deliveryOption: string | null;
}

export interface UpdateCart {
  updateCart: UpdateCart_updateCart | null;
}

export interface UpdateCartVariables {
  key?: string | null;
  qty?: number | null;
}
