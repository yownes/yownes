/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CustomerInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateCustomer
// ====================================================

export interface UpdateCustomer_updateCustomer_customer {
  __typename: "StripeCustomerType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The customer's address.
   */
  address: string | null;
  /**
   * The customer's full name or business name.
   */
  name: string;
  /**
   * The customer's phone number.
   */
  phone: string;
  /**
   * A set of key/value pairs that you can attach to an object. It can be useful for storing additional information about an object in a structured format.
   */
  metadata: string | null;
}

export interface UpdateCustomer_updateCustomer {
  __typename: "UpdateCustomerMutation";
  ok: boolean | null;
  error: string | null;
  customer: UpdateCustomer_updateCustomer_customer | null;
}

export interface UpdateCustomer {
  updateCustomer: UpdateCustomer_updateCustomer | null;
}

export interface UpdateCustomerVariables {
  customer: CustomerInput;
  userId: string;
}
