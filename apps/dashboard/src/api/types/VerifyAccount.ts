/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VerifyAccount
// ====================================================

export interface VerifyAccount_verifyAccount {
  __typename: "VerifyAccount";
  success: boolean | null;
  errors: any | null;
}

export interface VerifyAccount {
  /**
   * Verify user account.
   * 
   * Receive the token that was sent by email.
   * If the token is valid, make the user verified
   * by making the `user.status.verified` field true.
   */
  verifyAccount: VerifyAccount_verifyAccount | null;
}

export interface VerifyAccountVariables {
  token: string;
}
