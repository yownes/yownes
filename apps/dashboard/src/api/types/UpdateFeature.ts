/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FeatureInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateFeature
// ====================================================

export interface UpdateFeature_updateFeature {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface UpdateFeature {
  updateFeature: UpdateFeature_updateFeature | null;
}

export interface UpdateFeatureVariables {
  id: string;
  feature: FeatureInput;
}
