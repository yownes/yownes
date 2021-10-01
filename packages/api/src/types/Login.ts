/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Login
// ====================================================

export interface Login_accountLogin_customer {
  __typename: "Customer";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface Login_accountLogin {
  __typename: "LoginResult";
  token: string | null;
  customer: Login_accountLogin_customer | null;
}

export interface Login {
  accountLogin: Login_accountLogin | null;
}

export interface LoginVariables {
  email?: string | null;
  password?: string | null;
}
