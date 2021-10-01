/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: PaymentMethodList
// ====================================================

export interface PaymentMethodList_accountPaymentMethodList {
  __typename: "AccountPaymentMethod";
  id: string | null;
  name: string | null;
  last4: string | null;
  brand: string | null;
  expMonth: number | null;
  expYear: number | null;
}

export interface PaymentMethodList {
  accountPaymentMethodList: (PaymentMethodList_accountPaymentMethodList | null)[] | null;
}
