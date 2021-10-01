/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: TopSales
// ====================================================

export interface TopSales_bestSells {
  __typename: "Product";
  id: string | null;
  name: string | null;
  price: string | null;
  special: string | null;
  image: string | null;
  manufacturer: string | null;
}

export interface TopSales {
  bestSells: (TopSales_bestSells | null)[] | null;
}
