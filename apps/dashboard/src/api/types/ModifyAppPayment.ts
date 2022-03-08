/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PaymentMethodAppInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: ModifyAppPayment
// ====================================================

export interface ModifyAppPayment_modifyPaymentMethodApp {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface ModifyAppPayment {
  modifyPaymentMethodApp: ModifyAppPayment_modifyPaymentMethodApp | null;
}

export interface ModifyAppPaymentVariables {
  data: PaymentMethodAppInput;
  appId: string;
}
