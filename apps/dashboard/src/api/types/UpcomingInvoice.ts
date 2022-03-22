/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: UpcomingInvoice
// ====================================================

export interface UpcomingInvoice_upcominginvoice {
  __typename: "StripeUpcomingInvoiceType";
  /**
   * The ID of the object.
   */
  id: string;
  /**
   * The amount remaining, (as decimal), that is due.
   */
  amountRemaining: number | null;
  /**
   * Three-letter ISO currency code
   */
  currency: string;
  /**
   * Ending customer balance (in cents) after attempting to pay invoice. If the invoice has not been attempted yet, this will be null.
   */
  endingBalance: number | null;
  /**
   * The time at which payment will next be attempted.
   */
  nextPaymentAttempt: any | null;
  /**
   * A unique, identifying string that appears on emails sent to the customer for this invoice. This starts with the customer’s unique invoice_prefix if it is specified.
   */
  number: string;
  /**
   * Starting customer balance (in cents) before attempting to pay invoice. If the invoice has not been attempted yet, this will be the current customer balance.
   */
  startingBalance: number;
}

export interface UpcomingInvoice {
  upcominginvoice: UpcomingInvoice_upcominginvoice | null;
}

export interface UpcomingInvoiceVariables {
  cId: string;
  sId: string;
}
