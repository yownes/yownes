/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteFeature
// ====================================================

export interface DeleteFeature_deleteFeature {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface DeleteFeature {
  deleteFeature: DeleteFeature_deleteFeature | null;
}

export interface DeleteFeatureVariables {
  id: string;
}
