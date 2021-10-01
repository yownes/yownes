/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CarrierList
// ====================================================

export interface CarrierList_carrierList {
  __typename: "Carrier";
  id: string | null;
  reference: string | null;
  name: string | null;
  delay: string | null;
  price: string | null;
}

export interface CarrierList {
  carrierList: (CarrierList_carrierList | null)[] | null;
}
