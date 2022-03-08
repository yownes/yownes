/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: Builds
// ====================================================

export interface Builds_builds_edges_node_app_customer {
  __typename: "UserNode";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Requerido. 150 carácteres como máximo. Únicamente letras, dígitos y @/./+/-/_ 
   */
  username: string;
}

export interface Builds_builds_edges_node_app {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
  name: string;
  isActive: boolean | null;
  customer: Builds_builds_edges_node_app_customer | null;
}

export interface Builds_builds_edges_node {
  __typename: "BuildType";
  /**
   * The ID of the object.
   */
  id: string;
  buildId: any;
  date: any;
  buildStatus: BuildBuildStatus;
  app: Builds_builds_edges_node_app | null;
}

export interface Builds_builds_edges {
  __typename: "BuildTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Builds_builds_edges_node | null;
}

export interface Builds_builds {
  __typename: "BuildTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Builds_builds_edges | null)[];
}

export interface Builds {
  builds: Builds_builds | null;
}

export interface BuildsVariables {
  first?: number | null;
  last?: number | null;
}
