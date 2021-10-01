/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Favourites
// ====================================================

export interface Favourites_wishlist {
  __typename: "Product";
  id: string | null;
  name: string | null;
  price: string | null;
  special: string | null;
  image: string | null;
  manufacturer: string | null;
  inWishlist: boolean | null;
}

export interface Favourites {
  wishlist: (Favourites_wishlist | null)[] | null;
}
