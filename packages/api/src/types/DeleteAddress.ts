/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteAddress
// ====================================================

export interface DeleteAddress_accountRemoveAddress_zone {
  __typename: "Zone";
  id: string | null;
  name: string | null;
}

export interface DeleteAddress_accountRemoveAddress_country {
  __typename: "Country";
  id: string | null;
  name: string | null;
}

export interface DeleteAddress_accountRemoveAddress {
  __typename: "AccountAddress";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  zone: DeleteAddress_accountRemoveAddress_zone | null;
  country: DeleteAddress_accountRemoveAddress_country | null;
  zipcode: string | null;
  city: string | null;
}

export interface DeleteAddress {
  accountRemoveAddress: (DeleteAddress_accountRemoveAddress | null)[] | null;
}

export interface DeleteAddressVariables {
  id?: string | null;
}
