/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaymentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePaymentMethod
// ====================================================

export interface UpdatePaymentMethod_updatePaymentMethod {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface UpdatePaymentMethod {
  updatePaymentMethod: UpdatePaymentMethod_updatePaymentMethod | null;
}

export interface UpdatePaymentMethodVariables {
  id: string;
  paymentMethodId: string;
  payment: PaymentInput;
}
