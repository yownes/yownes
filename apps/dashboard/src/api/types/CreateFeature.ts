/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { FeatureInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateFeature
// ====================================================

export interface CreateFeature_createFeature_feature {
  __typename: "FeaturesType";
  /**
   * The ID of the object.
   */
  id: string;
  name: string;
}

export interface CreateFeature_createFeature {
  __typename: "CreateFeatureMutation";
  ok: boolean | null;
  error: string | null;
  feature: CreateFeature_createFeature_feature | null;
}

export interface CreateFeature {
  createFeature: CreateFeature_createFeature | null;
}

export interface CreateFeatureVariables {
  feature: FeatureInput;
}
