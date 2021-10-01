/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: CountriesList
// ====================================================

export interface CountriesList_countriesList_content {
  __typename: "Country";
  id: string | null;
  name: string | null;
}

export interface CountriesList_countriesList {
  __typename: "CountriesResult";
  content: (CountriesList_countriesList_content | null)[] | null;
}

export interface CountriesList {
  countriesList: CountriesList_countriesList | null;
}
