/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAddressInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: EditAddress
// ====================================================

export interface EditAddress_accountEditAddress_zone {
  __typename: "Zone";
  id: string | null;
  name: string | null;
}

export interface EditAddress_accountEditAddress_country {
  __typename: "Country";
  id: string | null;
  name: string | null;
}

export interface EditAddress_accountEditAddress {
  __typename: "AccountAddress";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  zone: EditAddress_accountEditAddress_zone | null;
  country: EditAddress_accountEditAddress_country | null;
  zipcode: string | null;
  city: string | null;
}

export interface EditAddress {
  accountEditAddress: EditAddress_accountEditAddress | null;
}

export interface EditAddressVariables {
  id?: string | null;
  address?: AccountAddressInput | null;
}
