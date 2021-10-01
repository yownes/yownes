/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Profile
// ====================================================

export interface Profile_accountCheckLogged_customer {
  __typename: "Customer";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

export interface Profile_accountCheckLogged {
  __typename: "LoggedResult";
  status: boolean | null;
  customer: Profile_accountCheckLogged_customer | null;
}

export interface Profile {
  accountCheckLogged: Profile_accountCheckLogged | null;
}
