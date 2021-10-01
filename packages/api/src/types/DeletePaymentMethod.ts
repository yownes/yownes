/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeletePaymentMethod
// ====================================================

export interface DeletePaymentMethod_accountRemovePaymentMethod {
  __typename: "AccountPaymentMethod";
  id: string | null;
  name: string | null;
  last4: string | null;
  brand: string | null;
  expMonth: number | null;
  expYear: number | null;
}

export interface DeletePaymentMethod {
  accountRemovePaymentMethod: (DeletePaymentMethod_accountRemovePaymentMethod | null)[] | null;
}

export interface DeletePaymentMethodVariables {
  id?: string | null;
}
