/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: AddToFavourite
// ====================================================

export interface AddToFavourite_addToWishlist {
  __typename: "Product";
  id: string | null;
  inWishlist: boolean | null;
}

export interface AddToFavourite {
  addToWishlist: (AddToFavourite_addToWishlist | null)[] | null;
}

export interface AddToFavouriteVariables {
  id?: number | null;
}
