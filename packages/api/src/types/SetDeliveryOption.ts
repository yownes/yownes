/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SetDeliveryOption
// ====================================================

export interface SetDeliveryOption_setDeliveryOption_total {
  __typename: "CartTotal";
  amount: number | null;
  value: string | null;
  label: string | null;
}

export interface SetDeliveryOption_setDeliveryOption_subtotals_products {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface SetDeliveryOption_setDeliveryOption_subtotals_discounts {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface SetDeliveryOption_setDeliveryOption_subtotals_shipping {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface SetDeliveryOption_setDeliveryOption_subtotals {
  __typename: "CartSubtotals";
  products: SetDeliveryOption_setDeliveryOption_subtotals_products | null;
  discounts: SetDeliveryOption_setDeliveryOption_subtotals_discounts | null;
  shipping: SetDeliveryOption_setDeliveryOption_subtotals_shipping | null;
}

export interface SetDeliveryOption_setDeliveryOption_products_option {
  __typename: "CartProductOption";
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface SetDeliveryOption_setDeliveryOption_products_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  price: string | null;
}

export interface SetDeliveryOption_setDeliveryOption_products {
  __typename: "CartProduct";
  key: string | null;
  quantity: number | null;
  total: string | null;
  option: (SetDeliveryOption_setDeliveryOption_products_option | null)[] | null;
  product: SetDeliveryOption_setDeliveryOption_products_product | null;
}

export interface SetDeliveryOption_setDeliveryOption_vouchers_added {
  __typename: "Voucher";
  id: string | null;
  name: string | null;
  code: string | null;
  reduction: string | null;
}

export interface SetDeliveryOption_setDeliveryOption_vouchers {
  __typename: "Vouchers";
  allowed: boolean | null;
  added: (SetDeliveryOption_setDeliveryOption_vouchers_added | null)[] | null;
}

export interface SetDeliveryOption_setDeliveryOption {
  __typename: "Cart";
  id: string | null;
  total: SetDeliveryOption_setDeliveryOption_total | null;
  subtotals: SetDeliveryOption_setDeliveryOption_subtotals | null;
  products: (SetDeliveryOption_setDeliveryOption_products | null)[] | null;
  vouchers: SetDeliveryOption_setDeliveryOption_vouchers | null;
  deliveryOption: string | null;
}

export interface SetDeliveryOption {
  setDeliveryOption: SetDeliveryOption_setDeliveryOption | null;
}

export interface SetDeliveryOptionVariables {
  option?: string | null;
}
