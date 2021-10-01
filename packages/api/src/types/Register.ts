/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CustomerInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_accountRegister {
  __typename: "Customer";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface Register {
  accountRegister: Register_accountRegister | null;
}

export interface RegisterVariables {
  customer?: CustomerInput | null;
}
