/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveDiscount
// ====================================================

export interface RemoveDiscount_removeDiscount_total {
  __typename: "CartTotal";
  amount: number | null;
  value: string | null;
  label: string | null;
}

export interface RemoveDiscount_removeDiscount_subtotals_products {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface RemoveDiscount_removeDiscount_subtotals_discounts {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface RemoveDiscount_removeDiscount_subtotals_shipping {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface RemoveDiscount_removeDiscount_subtotals {
  __typename: "CartSubtotals";
  products: RemoveDiscount_removeDiscount_subtotals_products | null;
  discounts: RemoveDiscount_removeDiscount_subtotals_discounts | null;
  shipping: RemoveDiscount_removeDiscount_subtotals_shipping | null;
}

export interface RemoveDiscount_removeDiscount_products_option {
  __typename: "CartProductOption";
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface RemoveDiscount_removeDiscount_products_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  price: string | null;
}

export interface RemoveDiscount_removeDiscount_products {
  __typename: "CartProduct";
  key: string | null;
  quantity: number | null;
  total: string | null;
  option: (RemoveDiscount_removeDiscount_products_option | null)[] | null;
  product: RemoveDiscount_removeDiscount_products_product | null;
}

export interface RemoveDiscount_removeDiscount_vouchers_added {
  __typename: "Voucher";
  id: string | null;
  name: string | null;
  code: string | null;
  reduction: string | null;
}

export interface RemoveDiscount_removeDiscount_vouchers {
  __typename: "Vouchers";
  allowed: boolean | null;
  added: (RemoveDiscount_removeDiscount_vouchers_added | null)[] | null;
}

export interface RemoveDiscount_removeDiscount {
  __typename: "Cart";
  id: string | null;
  total: RemoveDiscount_removeDiscount_total | null;
  subtotals: RemoveDiscount_removeDiscount_subtotals | null;
  products: (RemoveDiscount_removeDiscount_products | null)[] | null;
  vouchers: RemoveDiscount_removeDiscount_vouchers | null;
  deliveryOption: string | null;
}

export interface RemoveDiscount {
  removeDiscount: RemoveDiscount_removeDiscount | null;
}

export interface RemoveDiscountVariables {
  id?: string | null;
}
