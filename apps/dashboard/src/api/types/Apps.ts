/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: Apps
// ====================================================

export interface Apps_apps_edges_node_storeLinks {
  __typename: "StoreLinks";
  ios: string | null;
  android: string | null;
}

export interface Apps_apps_edges_node_builds_edges_node {
  __typename: "BuildType";
  /**
   * The ID of the object.
   */
  id: string;
  buildStatus: BuildBuildStatus;
  buildId: any;
  date: any;
}

export interface Apps_apps_edges_node_builds_edges {
  __typename: "BuildTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Apps_apps_edges_node_builds_edges_node | null;
}

export interface Apps_apps_edges_node_builds {
  __typename: "BuildTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Apps_apps_edges_node_builds_edges | null)[];
}

export interface Apps_apps_edges_node {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
  logo: string | null;
  name: string;
  isActive: boolean | null;
  /**
   * Link to GraphQl API of the store
   */
  apiLink: string | null;
  storeLinks: Apps_apps_edges_node_storeLinks | null;
  builds: Apps_apps_edges_node_builds;
}

export interface Apps_apps_edges {
  __typename: "StoreAppTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Apps_apps_edges_node | null;
}

export interface Apps_apps {
  __typename: "StoreAppTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Apps_apps_edges | null)[];
}

export interface Apps {
  apps: Apps_apps | null;
}

export interface AppsVariables {
  is_active: boolean;
}
