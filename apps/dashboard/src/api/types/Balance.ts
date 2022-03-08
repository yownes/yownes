/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Balance
// ====================================================

export interface Balance_balance {
  __typename: "StripeBalanceType";
  /**
   * Current balance (in cents), if any, being stored on the customer's account. If negative, the customer has credit to apply to the next invoice. If positive, the customer has an amount owed that will be added to the next invoice. The balance does not refer to any unpaid invoices; it solely takes into account amounts that have yet to be successfully applied to any invoice. This balance is only taken into account for recurring billing purposes (i.e., subscriptions, invoices, invoice items).
   */
  balance: number;
}

export interface Balance {
  balance: Balance_balance | null;
}

export interface BalanceVariables {
  Id: string;
}
