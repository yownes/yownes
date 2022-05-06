/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AccountAccountStatus } from "./globalTypes";

// ====================================================
// GraphQL query operation: Clients
// ====================================================

export interface Clients_users_edges_node_apps_edges_node {
  __typename: "StoreAppType";
  /**
   * The ID of the object.
   */
  id: string;
  isActive: boolean | null;
}

export interface Clients_users_edges_node_apps_edges {
  __typename: "StoreAppTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Clients_users_edges_node_apps_edges_node | null;
}

export interface Clients_users_edges_node_apps {
  __typename: "StoreAppTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Clients_users_edges_node_apps_edges | null)[];
}

export interface Clients_users_edges_node_subscription_plan_product {
  __typename: "StripeProductType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The product's name, meant to be displayable to the customer. Applicable to both `service` and `good` types.
   */
  name: string;
}

export interface Clients_users_edges_node_subscription_plan {
  __typename: "StripePlanType";
  /**
   * The product whose pricing this plan determines.
   */
  product: Clients_users_edges_node_subscription_plan_product | null;
}

export interface Clients_users_edges_node_subscription {
  __typename: "StripeSubscriptionType";
  /**
   * The plan associated with this subscription. This value will be `null` for multi-plan subscriptions
   */
  plan: Clients_users_edges_node_subscription_plan | null;
}

export interface Clients_users_edges_node {
  __typename: "UserNode";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Requerido. 150 carácteres como máximo. Únicamente letras, dígitos y @/./+/-/_ 
   */
  username: string;
  apps: Clients_users_edges_node_apps;
  /**
   * The user's Stripe Subscription object, if it exists
   */
  subscription: Clients_users_edges_node_subscription | null;
  accountStatus: AccountAccountStatus;
  verified: boolean | null;
  /**
   * Indica si el usuario debe ser tratado como activo. Desmarque esta opción en lugar de borrar la cuenta.
   */
  isActive: boolean;
  /**
   * Indica si el usuario puede entrar en este sitio de administración.
   */
  isStaff: boolean;
  dateJoined: any;
}

export interface Clients_users_edges {
  __typename: "UserNodeEdge";
  /**
   * The item at the end of the edge
   */
  node: Clients_users_edges_node | null;
}

export interface Clients_users {
  __typename: "UserNodeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Clients_users_edges | null)[];
}

export interface Clients {
  users: Clients_users | null;
}

export interface ClientsVariables {
  first?: number | null;
  last?: number | null;
}
