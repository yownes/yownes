/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: CreatePaymentIntent
// ====================================================

export interface CreatePaymentIntent_createPaymentIntent {
  __typename: "PaymentIntent";
  clientSecret: string | null;
}

export interface CreatePaymentIntent {
  createPaymentIntent: CreatePaymentIntent_createPaymentIntent | null;
}

export interface CreatePaymentIntentVariables {
  paymentMethod?: string | null;
}
