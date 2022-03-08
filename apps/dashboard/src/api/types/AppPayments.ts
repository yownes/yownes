/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppPayments
// ====================================================

export interface AppPayments_app_paymentMethod {
  __typename: "PaymentType";
  /**
   * The ID of the object.
   */
  id: string;
  stripeTestPublic: string;
  stripeTestSecret: string;
  stripeProdPublic: string;
  stripeProdSecret: string;
}

export interface AppPayments_app {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
  paymentMethod: AppPayments_app_paymentMethod | null;
}

export interface AppPayments {
  /**
   * The ID of the object
   */
  app: AppPayments_app | null;
}

export interface AppPaymentsVariables {
  id: string;
}
