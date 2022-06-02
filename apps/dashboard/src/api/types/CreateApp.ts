/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StoreAppInput, BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateApp
// ====================================================

export interface CreateApp_createApp_storeApp_storeLinks {
  __typename: "StoreLinks";
  ios: string | null;
  android: string | null;
}

export interface CreateApp_createApp_storeApp_builds_edges_node {
  __typename: "BuildType";
  /**
   * The ID of the object.
   */
  id: string;
  buildStatus: BuildBuildStatus;
}

export interface CreateApp_createApp_storeApp_builds_edges {
  __typename: "BuildTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: CreateApp_createApp_storeApp_builds_edges_node | null;
}

export interface CreateApp_createApp_storeApp_builds {
  __typename: "BuildTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (CreateApp_createApp_storeApp_builds_edges | null)[];
}

export interface CreateApp_createApp_storeApp {
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
  storeLinks: CreateApp_createApp_storeApp_storeLinks | null;
  builds: CreateApp_createApp_storeApp_builds;
}

export interface CreateApp_createApp {
  __typename: "CreateStoreAppMutation";
  ok: boolean | null;
  error: string | null;
  storeApp: CreateApp_createApp_storeApp | null;
}

export interface CreateApp {
  createApp: CreateApp_createApp | null;
}

export interface CreateAppVariables {
  data: StoreAppInput;
}
