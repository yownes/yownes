/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreatePlan
// ====================================================

export interface CreatePlan_createPlan_plan_features_edges_node {
  __typename: "FeaturesType";
  /**
   * The ID of the object.
   */
  id: string;
}

export interface CreatePlan_createPlan_plan_features_edges {
  __typename: "FeaturesTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: CreatePlan_createPlan_plan_features_edges_node | null;
}

export interface CreatePlan_createPlan_plan_features {
  __typename: "FeaturesTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (CreatePlan_createPlan_plan_features_edges | null)[];
}

export interface CreatePlan_createPlan_plan_prices_edges_node {
  __typename: "StripePriceType";
  /**
   * The ID of the object.
   */
  id: string;
}

export interface CreatePlan_createPlan_plan_prices_edges {
  __typename: "StripePriceTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: CreatePlan_createPlan_plan_prices_edges_node | null;
}

export interface CreatePlan_createPlan_plan_prices {
  __typename: "StripePriceTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (CreatePlan_createPlan_plan_prices_edges | null)[];
}

export interface CreatePlan_createPlan_plan {
  __typename: "StripeProductType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Whether the product is currently available for purchase. Only applicable to products of `type=good`.
   */
  active: boolean | null;
  /**
   * A description of this object.
   */
  description: string | null;
  features: CreatePlan_createPlan_plan_features;
  /**
   * A set of key/value pairs that you can attach to an object. It can be useful for storing additional information about an object in a structured format.
   */
  metadata: any | null;
  /**
   * The product's name, meant to be displayable to the customer. Applicable to both `service` and `good` types.
   */
  name: string;
  /**
   * The product this price is associated with.
   */
  prices: CreatePlan_createPlan_plan_prices;
}

export interface CreatePlan_createPlan {
  __typename: "CreatePlanMutation";
  ok: boolean | null;
  error: string | null;
  plan: CreatePlan_createPlan_plan | null;
}

export interface CreatePlan {
  createPlan: CreatePlan_createPlan | null;
}

export interface CreatePlanVariables {
  plan: ProductInput;
}
