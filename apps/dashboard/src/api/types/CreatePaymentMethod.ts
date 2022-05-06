/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreatePaymentInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePaymentMethod
// ====================================================

export interface CreatePaymentMethod_createPaymentMethod {
  __typename: "CreatePaymentMethod";
  ok: boolean | null;
  error: string | null;
  id: string | null;
}

export interface CreatePaymentMethod {
  createPaymentMethod: CreatePaymentMethod_createPaymentMethod | null;
}

export interface CreatePaymentMethodVariables {
  payment: CreatePaymentInput;
}
