/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL fragment: AppBasicData
// ====================================================

export interface AppBasicData_storeLinks {
  __typename: "StoreLinks";
  ios: string | null;
  android: string | null;
}

export interface AppBasicData_builds_edges_node {
  __typename: "BuildType";
  /**
   * The ID of the object.
   */
  id: string;
  buildStatus: BuildBuildStatus;
  buildId: any;
  date: any;
}

export interface AppBasicData_builds_edges {
  __typename: "BuildTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: AppBasicData_builds_edges_node | null;
}

export interface AppBasicData_builds {
  __typename: "BuildTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (AppBasicData_builds_edges | null)[];
}

export interface AppBasicData {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Description to Stores card info
   */
  description: string | null;
  logo: string | null;
  name: string;
  isActive: boolean | null;
  /**
   * Link to GraphQl API of the store
   */
  apiLink: string | null;
  storeLinks: AppBasicData_storeLinks | null;
  builds: AppBasicData_builds;
}
