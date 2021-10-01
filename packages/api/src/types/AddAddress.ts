/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAddressInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: AddAddress
// ====================================================

export interface AddAddress_accountAddAddress_zone {
  __typename: "Zone";
  id: string | null;
  name: string | null;
}

export interface AddAddress_accountAddAddress_country {
  __typename: "Country";
  id: string | null;
  name: string | null;
}

export interface AddAddress_accountAddAddress {
  __typename: "AccountAddress";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  zone: AddAddress_accountAddAddress_zone | null;
  country: AddAddress_accountAddAddress_country | null;
  zipcode: string | null;
  city: string | null;
}

export interface AddAddress {
  accountAddAddress: AddAddress_accountAddAddress | null;
}

export interface AddAddressVariables {
  address?: AccountAddressInput | null;
}
