/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AppOwnerActive
// ====================================================

export interface AppOwnerActive_appcustomer {
  __typename: "StoreAppCustomerType";
  isOwnerAndActive: boolean | null;
}

export interface AppOwnerActive {
  appcustomer: AppOwnerActive_appcustomer | null;
}

export interface AppOwnerActiveVariables {
  id: string;
}
