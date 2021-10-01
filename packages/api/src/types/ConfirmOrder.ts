/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ConfirmOrder
// ====================================================

export interface ConfirmOrder_confirmOrder_order {
  __typename: "Order";
  id: string | null;
}

export interface ConfirmOrder_confirmOrder {
  __typename: "ConfirmOrderResult";
  order: ConfirmOrder_confirmOrder_order | null;
}

export interface ConfirmOrder {
  confirmOrder: ConfirmOrder_confirmOrder | null;
}

export interface ConfirmOrderVariables {
  paymentAddress?: string | null;
  shippingAddress?: string | null;
}
