/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL fragment: AddressFragment
// ====================================================

export interface AddressFragment_zone {
  __typename: "Zone";
  id: string | null;
  name: string | null;
}

export interface AddressFragment_country {
  __typename: "Country";
  id: string | null;
  name: string | null;
}

export interface AddressFragment {
  __typename: "AccountAddress";
  id: string | null;
  firstName: string | null;
  lastName: string | null;
  company: string | null;
  address1: string | null;
  address2: string | null;
  zone: AddressFragment_zone | null;
  country: AddressFragment_country | null;
  zipcode: string | null;
  city: string | null;
}
