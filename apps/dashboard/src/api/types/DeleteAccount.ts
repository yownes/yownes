/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteAccount
// ====================================================

export interface DeleteAccount_deleteAccount {
  __typename: "DeleteAccount";
  success: boolean | null;
  errors: any | null;
}

export interface DeleteAccount {
  /**
   * Delete account permanently or make `user.is_active=False`.
   * 
   * The behavior is defined on settings.
   * Anyway user refresh tokens are revoked.
   * 
   * User must be verified and confirm password.
   */
  deleteAccount: DeleteAccount_deleteAccount | null;
}

export interface DeleteAccountVariables {
  password: string;
}
