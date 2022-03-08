/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SelectDefaultPaymentMethod
// ====================================================

export interface SelectDefaultPaymentMethod_selectDefaultPaymentMethod {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface SelectDefaultPaymentMethod {
  selectDefaultPaymentMethod: SelectDefaultPaymentMethod_selectDefaultPaymentMethod | null;
}

export interface SelectDefaultPaymentMethodVariables {
  paymentMethodId: string;
}
