/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: ZonesList
// ====================================================

export interface ZonesList_zonesList_content {
  __typename: "Zone";
  id: string | null;
  name: string | null;
}

export interface ZonesList_zonesList {
  __typename: "ZonesResult";
  content: (ZonesList_zonesList_content | null)[] | null;
}

export interface ZonesList {
  zonesList: ZonesList_zonesList | null;
}

export interface ZonesListVariables {
  countryId?: string | null;
}
