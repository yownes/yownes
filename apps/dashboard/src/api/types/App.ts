/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: App
// ====================================================

export interface App_app_color {
  __typename: "StoreColors";
  color: string | null;
  text: string | null;
}

export interface App_app_customer {
  __typename: "UserNode";
  /**
   * The ID of the object.
   */
  id: string;
}

export interface App_app_template {
  __typename: "TemplateType";
  /**
   * The ID of the object.
   */
  id: string;
}

export interface App_app_builds_edges_node {
  __typename: "BuildType";
  /**
   * The ID of the object.
   */
  id: string;
  buildStatus: BuildBuildStatus;
  date: any;
}

export interface App_app_builds_edges {
  __typename: "BuildTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: App_app_builds_edges_node | null;
}

export interface App_app_builds {
  __typename: "BuildTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (App_app_builds_edges | null)[];
}

export interface App_app_storeLinks {
  __typename: "StoreLinks";
  ios: string | null;
  android: string | null;
}

export interface App_app {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
  name: string;
  color: App_app_color | null;
  customer: App_app_customer | null;
  /**
   * Link to GraphQl API of the store
   */
  apiLink: string | null;
  template: App_app_template | null;
  logo: string | null;
  builds: App_app_builds;
  storeLinks: App_app_storeLinks | null;
}

export interface App {
  app: App_app | null;
}

export interface AppVariables {
  id: string;
}
