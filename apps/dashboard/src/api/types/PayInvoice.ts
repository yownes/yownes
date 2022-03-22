/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { InvoiceBillingReason, ChargeStatus, InvoiceStatus, SubscriptionStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: PayInvoice
// ====================================================

export interface PayInvoice_payInvoice_invoice_charges_edges_node_paymentIntent {
  __typename: "StripePaymentIntentType";
  /**
   * The ID of the object.
   */
  id: string;
  stripeId: string | null;
}

export interface PayInvoice_payInvoice_invoice_charges_edges_node_paymentMethod {
  __typename: "StripePaymentMethodType";
  /**
   * The ID of the object.
   */
  id: string;
  stripeId: string | null;
  /**
   * Additional information for payment methods of type `card`
   */
  card: string | null;
}

export interface PayInvoice_payInvoice_invoice_charges_edges_node {
  __typename: "StripeChargeType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Amount charged (as decimal).
   */
  amount: number;
  /**
   * The datetime this object was created in stripe.
   */
  created: any | null;
  /**
   * The currency in which the charge was made.
   */
  currency: string;
  /**
   * Message to user further explaining reason for charge failure if available.
   */
  failureMessage: string;
  /**
   * True if the charge succeeded, or was successfully authorized for later capture, False otherwise.
   */
  paid: boolean;
  /**
   * PaymentIntent associated with this charge, if one exists.
   */
  paymentIntent: PayInvoice_payInvoice_invoice_charges_edges_node_paymentIntent | null;
  /**
   * PaymentMethod used in this charge.
   */
  paymentMethod: PayInvoice_payInvoice_invoice_charges_edges_node_paymentMethod | null;
  /**
   * The status of the payment.
   */
  status: ChargeStatus;
  stripeId: string | null;
}

export interface PayInvoice_payInvoice_invoice_charges_edges {
  __typename: "StripeChargeTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: PayInvoice_payInvoice_invoice_charges_edges_node | null;
}

export interface PayInvoice_payInvoice_invoice_charges {
  __typename: "StripeChargeTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (PayInvoice_payInvoice_invoice_charges_edges | null)[];
}

export interface PayInvoice_payInvoice_invoice_customer {
  __typename: "StripeCustomerType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The customer's address.
   */
  address: string | null;
  /**
   * Current balance (in cents), if any, being stored on the customer's account. If negative, the customer has credit to apply to the next invoice. If positive, the customer has an amount owed that will be added to the next invoice. The balance does not refer to any unpaid invoices; it solely takes into account amounts that have yet to be successfully applied to any invoice. This balance is only taken into account for recurring billing purposes (i.e., subscriptions, invoices, invoice items).
   */
  balance: number;
  email: string;
  /**
   * The customer's full name or business name.
   */
  name: string;
}

export interface PayInvoice_payInvoice_invoice_invoiceitems_edges_node_price {
  __typename: "StripePriceType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The unit amount in cents to be charged, represented as a whole integer if possible. Null if a sub-cent precision is required.
   */
  unitAmount: number | null;
}

export interface PayInvoice_payInvoice_invoice_invoiceitems_edges_node {
  __typename: "StripeInvoiceItemType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Amount invoiced (as decimal).
   */
  amount: number;
  /**
   * Three-letter ISO currency code
   */
  currency: string;
  /**
   * A description of this object.
   */
  description: string | null;
  /**
   * Might be the date when this invoiceitem's invoice was sent.
   */
  periodEnd: any;
  /**
   * Might be the date when this invoiceitem was added to the invoice
   */
  periodStart: any;
  /**
   * If the invoice item is a proration, the price of the subscription for which the proration was computed.
   */
  price: PayInvoice_payInvoice_invoice_invoiceitems_edges_node_price | null;
  /**
   * Whether or not the invoice item was created automatically as a proration adjustment when the customer switched plans.
   */
  proration: boolean;
  /**
   * If the invoice item is a proration, the quantity of the subscription for which the proration was computed.
   */
  quantity: number | null;
}

export interface PayInvoice_payInvoice_invoice_invoiceitems_edges {
  __typename: "StripeInvoiceItemTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: PayInvoice_payInvoice_invoice_invoiceitems_edges_node | null;
}

export interface PayInvoice_payInvoice_invoice_invoiceitems {
  __typename: "StripeInvoiceItemTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (PayInvoice_payInvoice_invoice_invoiceitems_edges | null)[];
}

export interface PayInvoice_payInvoice_invoice_paymentIntent_paymentMethod {
  __typename: "StripePaymentMethodType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Additional information for payment methods of type `card`
   */
  card: string | null;
}

export interface PayInvoice_payInvoice_invoice_paymentIntent {
  __typename: "StripePaymentIntentType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The payment error encountered in the previous PaymentIntent confirmation.
   */
  lastPaymentError: string | null;
  /**
   * Payment method used in this PaymentIntent.
   */
  paymentMethod: PayInvoice_payInvoice_invoice_paymentIntent_paymentMethod | null;
}

export interface PayInvoice_payInvoice_invoice_subscription_plan_product {
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

export interface PayInvoice_payInvoice_invoice_subscription_plan {
  __typename: "StripePlanType";
  /**
   * The product whose pricing this plan determines.
   */
  product: PayInvoice_payInvoice_invoice_subscription_plan_product | null;
}

export interface PayInvoice_payInvoice_invoice_subscription {
  __typename: "StripeSubscriptionType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The plan associated with this subscription. This value will be `null` for multi-plan subscriptions
   */
  plan: PayInvoice_payInvoice_invoice_subscription_plan | null;
  /**
   * The status of this subscription.
   */
  status: SubscriptionStatus;
  stripeId: string | null;
}

export interface PayInvoice_payInvoice_invoice {
  __typename: "StripeInvoiceType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * Final amount due (as decimal) at this time for this invoice. If the invoice's total is smaller than the minimum charge amount, for example, or if there is account credit that can be applied to the invoice, the amount_due may be 0. If there is a positive starting_balance for the invoice (the customer owes money), the amount_due will also take that into account. The charge that gets generated for the invoice will be for the amount specified in amount_due.
   */
  amountDue: number;
  /**
   * The amount, (as decimal), that was paid.
   */
  amountPaid: number | null;
  /**
   * The amount remaining, (as decimal), that is due.
   */
  amountRemaining: number | null;
  /**
   * Indicates the reason why the invoice was created. subscription_cycle indicates an invoice created by a subscription advancing into a new period. subscription_create indicates an invoice created due to creating a subscription. subscription_update indicates an invoice created due to updating a subscription. subscription is set for all old invoices to indicate either a change to a subscription or a period advancement. manual is set for all invoices unrelated to a subscription (for example: created via the invoice editor). The upcoming value is reserved for simulated invoices per the upcoming invoice endpoint. subscription_threshold indicates an invoice created due to a billing threshold being reached.
   */
  billingReason: InvoiceBillingReason | null;
  /**
   * The invoice this charge is for if one exists.
   */
  charges: PayInvoice_payInvoice_invoice_charges;
  /**
   * The datetime this object was created in stripe.
   */
  created: any | null;
  /**
   * Three-letter ISO currency code
   */
  currency: string;
  /**
   * The customer associated with this invoice.
   */
  customer: PayInvoice_payInvoice_invoice_customer;
  /**
   * Ending customer balance (in cents) after attempting to pay invoice. If the invoice has not been attempted yet, this will be null.
   */
  endingBalance: number | null;
  /**
   * The invoice to which this invoiceitem is attached.
   */
  invoiceitems: PayInvoice_payInvoice_invoice_invoiceitems;
  /**
   * The link to download the PDF for the invoice. If the invoice has not been frozen yet, this will be null.
   */
  invoicePdf: string;
  /**
   * The time at which payment will next be attempted.
   */
  nextPaymentAttempt: any | null;
  /**
   * A unique, identifying string that appears on emails sent to the customer for this invoice. This starts with the customer’s unique invoice_prefix if it is specified.
   */
  number: string;
  /**
   * The PaymentIntent associated with this invoice. The PaymentIntent is generated when the invoice is finalized, and can then be used to pay the invoice.Note that voiding an invoice will cancel the PaymentIntent
   */
  paymentIntent: PayInvoice_payInvoice_invoice_paymentIntent | null;
  /**
   * Starting customer balance (in cents) before attempting to pay invoice. If the invoice has not been attempted yet, this will be the current customer balance.
   */
  startingBalance: number;
  /**
   * The status of the invoice, one of draft, open, paid, uncollectible, or void.
   */
  status: InvoiceStatus | null;
  stripeId: string | null;
  /**
   * The subscription that this invoice was prepared for, if any.
   */
  subscription: PayInvoice_payInvoice_invoice_subscription | null;
  /**
   * Total (as decimal) of all subscriptions, invoice items, and prorations on the invoice before any discount or tax is applied.
   */
  subtotal: number;
  /**
   * The amount (as decimal) of tax included in the total, calculated from ``tax_percent`` and the subtotal. If no ``tax_percent`` is defined, this value will be null.
   */
  tax: number | null;
  /**
   * This percentage of the subtotal has been added to the total amount of the invoice, including invoice line items and discounts. This field is inherited from the subscription's ``tax_percent`` field, but can be changed before the invoice is paid. This field defaults to null.
   */
  taxPercent: number | null;
  total: number;
}

export interface PayInvoice_payInvoice {
  __typename: "PayInvoiceMutation";
  ok: boolean | null;
  error: string | null;
  invoice: PayInvoice_payInvoice_invoice | null;
}

export interface PayInvoice {
  payInvoice: PayInvoice_payInvoice | null;
}

export interface PayInvoiceVariables {
  invoiceId: string;
}
