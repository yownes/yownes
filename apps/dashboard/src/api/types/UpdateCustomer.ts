/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CustomerInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateCustomer
// ====================================================

export interface UpdateCustomer_updateCustomer {
  __typename: "UpdateCustomerMutation";
  ok: boolean | null;
  error: string | null;
}

export interface UpdateCustomer {
  updateCustomer: UpdateCustomer_updateCustomer | null;
}

export interface UpdateCustomerVariables {
  customer: CustomerInput;
  userId: string;
}
