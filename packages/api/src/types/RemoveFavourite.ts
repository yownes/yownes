/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RemoveFavourite
// ====================================================

export interface RemoveFavourite_removeWishlist {
  __typename: "Product";
  id: string | null;
  inWishlist: boolean | null;
}

export interface RemoveFavourite {
  removeWishlist: (RemoveFavourite_removeWishlist | null)[] | null;
}

export interface RemoveFavouriteVariables {
  id?: string | null;
}
