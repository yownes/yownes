/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: LimitBuilds
// ====================================================

export interface LimitBuilds_configs_edges_node {
  __typename: "ConfigType";
  /**
   * The ID of the object.
   */
  id: string;
  limit: number;
}

export interface LimitBuilds_configs_edges {
  __typename: "ConfigTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: LimitBuilds_configs_edges_node | null;
}

export interface LimitBuilds_configs {
  __typename: "ConfigTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (LimitBuilds_configs_edges | null)[];
}

export interface LimitBuilds {
  configs: LimitBuilds_configs | null;
}
