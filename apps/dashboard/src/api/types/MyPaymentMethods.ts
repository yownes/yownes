/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: MyPaymentMethods
// ====================================================

export interface MyPaymentMethods_me_customer_defaultPaymentMethod {
  __typename: "StripePaymentMethodType";
  /**
   * The ID of the object.
   */
  id: string;
  stripeId: string | null;
}

export interface MyPaymentMethods_me_customer_paymentMethods_edges_node {
  __typename: "StripePaymentMethodType";
  /**
   * The ID of the object.
   */
  id: string;
  stripeId: string | null;
  /**
   * Additional information for payment methods of type `card`
   */
  card: any | null;
  /**
   * Billing information associated with the PaymentMethod that may be used or required by particular types of payment methods.
   */
  billingDetails: any;
  /**
   * A set of key/value pairs that you can attach to an object. It can be useful for storing additional information about an object in a structured format.
   */
  metadata: any | null;
}

export interface MyPaymentMethods_me_customer_paymentMethods_edges {
  __typename: "StripePaymentMethodTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: MyPaymentMethods_me_customer_paymentMethods_edges_node | null;
}

export interface MyPaymentMethods_me_customer_paymentMethods {
  __typename: "StripePaymentMethodTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (MyPaymentMethods_me_customer_paymentMethods_edges | null)[];
}

export interface MyPaymentMethods_me_customer {
  __typename: "StripeCustomerType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * default payment method used for subscriptions and invoices for the customer.
   */
  defaultPaymentMethod: MyPaymentMethods_me_customer_defaultPaymentMethod | null;
  /**
   * Customer to which this PaymentMethod is saved. This will not be set when the PaymentMethod has not been saved to a Customer.
   */
  paymentMethods: MyPaymentMethods_me_customer_paymentMethods;
}

export interface MyPaymentMethods_me {
  __typename: "UserNode";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The user's Stripe Customer object, if it exists
   */
  customer: MyPaymentMethods_me_customer | null;
}

export interface MyPaymentMethods {
  me: MyPaymentMethods_me | null;
}
