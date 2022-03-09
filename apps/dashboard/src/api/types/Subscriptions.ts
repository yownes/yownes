/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { SubscriptionStatus, PlanInterval } from "./globalTypes";

// ====================================================
// GraphQL query operation: Subscriptions
// ====================================================

export interface Subscriptions_subscriptions_edges_node_plan_product_features_edges_node {
  __typename: "FeaturesType";
  /**
   * The ID of the object.
   */
  id: string;
  name: string;
}

export interface Subscriptions_subscriptions_edges_node_plan_product_features_edges {
  __typename: "FeaturesTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Subscriptions_subscriptions_edges_node_plan_product_features_edges_node | null;
}

export interface Subscriptions_subscriptions_edges_node_plan_product_features {
  __typename: "FeaturesTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Subscriptions_subscriptions_edges_node_plan_product_features_edges | null)[];
}

export interface Subscriptions_subscriptions_edges_node_plan_product {
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
  features: Subscriptions_subscriptions_edges_node_plan_product_features;
}

export interface Subscriptions_subscriptions_edges_node_plan {
  __typename: "StripePlanType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Amount (as decimal) to be charged on the interval specified.
   */
  amount: any | null;
  /**
   * Three-letter ISO currency code
   */
  currency: string;
  /**
   * The frequency with which a subscription should be billed.
   */
  interval: PlanInterval;
  /**
   * The product whose pricing this plan determines.
   */
  product: Subscriptions_subscriptions_edges_node_plan_product | null;
}

export interface Subscriptions_subscriptions_edges_node {
  __typename: "StripeSubscriptionType";
  /**
   * The ID of the object.
   */
  id: string;
  stripeId: string | null;
  /**
   * The status of this subscription.
   */
  status: SubscriptionStatus;
  /**
   * The datetime this object was created in stripe.
   */
  created: any | null;
  /**
   * A date in the future at which the subscription will automatically get canceled.
   */
  cancelAt: any | null;
  /**
   * If the subscription has been canceled, the date of that cancellation. If the subscription was canceled with ``cancel_at_period_end``, canceled_at will still reflect the date of the initial cancellation request, not the end of the subscription period when the subscription is automatically moved to a canceled state.
   */
  canceledAt: any | null;
  /**
   * If the subscription has been canceled with the ``at_period_end`` flag set to true, ``cancel_at_period_end`` on the subscription will be true. You can use this attribute to determine whether a subscription that has a status of active is scheduled to be canceled at the end of the current period.
   */
  cancelAtPeriodEnd: boolean;
  /**
   * If the subscription has ended (either because it was canceled or because the customer was switched to a subscription to a new plan), the date the subscription ended.
   */
  endedAt: any | null;
  /**
   * The plan associated with this subscription. This value will be `null` for multi-plan subscriptions
   */
  plan: Subscriptions_subscriptions_edges_node_plan | null;
}

export interface Subscriptions_subscriptions_edges {
  __typename: "StripeSubscriptionTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Subscriptions_subscriptions_edges_node | null;
}

export interface Subscriptions_subscriptions {
  __typename: "StripeSubscriptionTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Subscriptions_subscriptions_edges | null)[];
}

export interface Subscriptions {
  subscriptions: Subscriptions_subscriptions | null;
}

export interface SubscriptionsVariables {
  userId: string;
}
