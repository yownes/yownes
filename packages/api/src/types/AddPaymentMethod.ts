/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddPaymentMethod
// ====================================================

export interface AddPaymentMethod_accountAddPaymentMethod {
  __typename: "AccountPaymentMethod";
  id: string | null;
  name: string | null;
  last4: string | null;
  brand: string | null;
  expMonth: number | null;
  expYear: number | null;
}

export interface AddPaymentMethod {
  accountAddPaymentMethod: AddPaymentMethod_accountAddPaymentMethod | null;
}

export interface AddPaymentMethodVariables {
  paymentMethod?: string | null;
}
