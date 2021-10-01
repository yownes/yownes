/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Orders
// ====================================================

export interface Orders_orders {
  __typename: "Order";
  id: string | null;
  reference: string | null;
  date: string | null;
  state: string | null;
  total: string | null;
}

export interface Orders {
  orders: (Orders_orders | null)[] | null;
}
