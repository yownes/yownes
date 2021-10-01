/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: AddressList
// ====================================================

export interface AddressList_accountAddressList_zone {
  __typename: "Zone";
  id: string | null;
  name: string | null;
}

export interface AddressList_accountAddressList_country {
  __typename: "Country";
  id: string | null;
  name: string | null;
}

export interface AddressList_accountAddressList {
  __typename: "AccountAddress";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  zone: AddressList_accountAddressList_zone | null;
  country: AddressList_accountAddressList_country | null;
  zipcode: string | null;
  city: string | null;
}

export interface AddressList {
  accountAddressList: (AddressList_accountAddressList | null)[] | null;
}
