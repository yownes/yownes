/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddPaymentMethod
// ====================================================

export interface AddPaymentMethod_addPaymentMethod {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface AddPaymentMethod {
  addPaymentMethod: AddPaymentMethod_addPaymentMethod | null;
}

export interface AddPaymentMethodVariables {
  isDefault?: boolean | null;
  paymentMethodId: string;
  userId?: string | null;
}
