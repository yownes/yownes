/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdatePrice
// ====================================================

export interface UpdatePrice_updatePrice {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface UpdatePrice {
  updatePrice: UpdatePrice_updatePrice | null;
}

export interface UpdatePriceVariables {
  id: string;
  active: boolean;
}
