/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Products
// ====================================================

export interface Products_features {
  __typename: "FeaturesType";
  id: string;
  name: string;
}

export interface Products_products_edges_node_features {
  __typename: "FeaturesType";
  id: string;
}

export interface Products_products_edges_node_prices_edges_node {
  __typename: "StripePriceType";
  /**
   * The ID of the object.
   */
  id: string;
  stripeId: string | null;
  /**
   * The recurring components of a price such as `interval` and `usage_type`.
   */
  recurring: any | null;
  /**
   * The unit amount in cents to be charged, represented as a whole integer if possible. Null if a sub-cent precision is required.
   */
  unitAmount: number | null;
  /**
   * Whether the price can be used for new purchases.
   */
  active: boolean;
}

export interface Products_products_edges_node_prices_edges {
  __typename: "StripePriceTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Products_products_edges_node_prices_edges_node | null;
}

export interface Products_products_edges_node_prices {
  __typename: "StripePriceTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Products_products_edges_node_prices_edges | null)[];
}

export interface Products_products_edges_node {
  __typename: "StripeProductType";
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
  metadata: any | null;
  features: Products_products_edges_node_features[];
  /**
   * The product this price is associated with.
   */
  prices: Products_products_edges_node_prices;
}

export interface Products_products_edges {
  __typename: "StripeProductTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Products_products_edges_node | null;
}

export interface Products_products {
  __typename: "StripeProductTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Products_products_edges | null)[];
}

export interface Products {
  features: (Products_features | null)[] | null;
  products: Products_products | null;
}
