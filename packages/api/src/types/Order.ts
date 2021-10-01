/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Order
// ====================================================

export interface Order_order_shippingAddress_zone {
  __typename: "Zone";
  id: string | null;
  name: string | null;
}

export interface Order_order_shippingAddress_country {
  __typename: "Country";
  id: string | null;
  name: string | null;
}

export interface Order_order_shippingAddress {
  __typename: "AccountAddress";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  zone: Order_order_shippingAddress_zone | null;
  country: Order_order_shippingAddress_country | null;
  zipcode: string | null;
  city: string | null;
}

export interface Order_order_paymentAddress_zone {
  __typename: "Zone";
  id: string | null;
  name: string | null;
}

export interface Order_order_paymentAddress_country {
  __typename: "Country";
  id: string | null;
  name: string | null;
}

export interface Order_order_paymentAddress {
  __typename: "AccountAddress";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  zone: Order_order_paymentAddress_zone | null;
  country: Order_order_paymentAddress_country | null;
  zipcode: string | null;
  city: string | null;
}

export interface Order_order_shippingMethod {
  __typename: "ShippingMethod";
  id: string | null;
  name: string | null;
}

export interface Order_order_products_option {
  __typename: "CartProductOption";
  name: string | null;
  value: string | null;
  type: string | null;
}

export interface Order_order_products_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  price: string | null;
}

export interface Order_order_products {
  __typename: "CartProduct";
  key: string | null;
  quantity: number | null;
  total: string | null;
  option: (Order_order_products_option | null)[] | null;
  product: Order_order_products_product | null;
}

export interface Order_order_subtotals {
  __typename: "Line";
  label: string | null;
  value: string | null;
}

export interface Order_order {
  __typename: "Order";
  id: string | null;
  reference: string | null;
  date: string | null;
  state: string | null;
  total: string | null;
  shippingAddress: Order_order_shippingAddress | null;
  paymentAddress: Order_order_paymentAddress | null;
  shippingMethod: Order_order_shippingMethod | null;
  products: (Order_order_products | null)[] | null;
  subtotals: (Order_order_subtotals | null)[] | null;
}

export interface Order {
  order: Order_order | null;
}

export interface OrderVariables {
  id?: string | null;
}
