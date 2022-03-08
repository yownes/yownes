/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PasswordReset
// ====================================================

export interface PasswordReset_passwordReset {
  __typename: "PasswordReset";
  success: boolean | null;
  errors: any | null;
}

export interface PasswordReset {
  /**
   * Change user password without old password.
   * 
   * Receive the token that was sent by email.
   * 
   * If token and new passwords are valid, update
   * user password and in case of using refresh
   * tokens, revoke all of them.
   * 
   * Also, if user has not been verified yet, verify it.
   */
  passwordReset: PasswordReset_passwordReset | null;
}

export interface PasswordResetVariables {
  token: string;
  newPassword1: string;
  newPassword2: string;
}
