/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemovePaymentMethod
// ====================================================

export interface RemovePaymentMethod_detachPaymentMethod {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface RemovePaymentMethod {
  detachPaymentMethod: RemovePaymentMethod_detachPaymentMethod | null;
}

export interface RemovePaymentMethodVariables {
  paymentMethodId: string;
  userId: string;
}
