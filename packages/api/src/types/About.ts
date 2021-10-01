/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: About
// ====================================================

export interface About_page {
  __typename: "Page";
  id: string | null;
  description: string | null;
}

export interface About_contact {
  __typename: "Contact";
  store: string | null;
  address: string | null;
  email: string | null;
  telephone: string | null;
}

export interface About {
  page: About_page | null;
  contact: About_contact | null;
}
