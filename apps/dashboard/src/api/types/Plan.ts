/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Plan
// ====================================================

export interface Plan_product_features_edges_node {
  __typename: "FeaturesType";
  /**
   * The ID of the object.
   */
  id: string;
  name: string;
}

export interface Plan_product_features_edges {
  __typename: "FeaturesTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Plan_product_features_edges_node | null;
}

export interface Plan_product_features {
  __typename: "FeaturesTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Plan_product_features_edges | null)[];
}

export interface Plan_product_prices_edges_node {
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

export interface Plan_product_prices_edges {
  __typename: "StripePriceTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Plan_product_prices_edges_node | null;
}

export interface Plan_product_prices {
  __typename: "StripePriceTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Plan_product_prices_edges | null)[];
}

export interface Plan_product {
  __typename: "StripeProductType";
  features: Plan_product_features;
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The product's name, meant to be displayable to the customer. Applicable to both `service` and `good` types.
   */
  name: string;
  /**
   * A description of this object.
   */
  description: string | null;
  /**
   * A set of key/value pairs that you can attach to an object. It can be useful for storing additional information about an object in a structured format.
   */
  metadata: string | null;
  /**
   * Whether the product is currently available for purchase. Only applicable to products of `type=good`.
   */
  active: boolean | null;
  /**
   * The product this price is associated with.
   */
  prices: Plan_product_prices;
}

export interface Plan {
  product: Plan_product | null;
}

export interface PlanVariables {
  id: string;
}
