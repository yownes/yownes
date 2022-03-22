/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { PriceInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePrice
// ====================================================

export interface CreatePrice_createPrice_price {
  __typename: "StripePriceType";
  /**
   * The ID of the object.
   */
  id: string;
  stripeId: string | null;
  /**
   * Three-letter ISO currency code
   */
  currency: string;
  /**
   * The recurring components of a price such as `interval` and `usage_type`.
   */
  recurring: string | null;
  /**
   * The unit amount in cents to be charged, represented as a whole integer if possible. Null if a sub-cent precision is required.
   */
  unitAmount: number | null;
  /**
   * Whether the price can be used for new purchases.
   */
  active: boolean;
}

export interface CreatePrice_createPrice {
  __typename: "CreatePriceMutation";
  ok: boolean | null;
  error: string | null;
  price: CreatePrice_createPrice_price | null;
}

export interface CreatePrice {
  createPrice: CreatePrice_createPrice | null;
}

export interface CreatePriceVariables {
  id: string;
  price: PriceInput;
}
