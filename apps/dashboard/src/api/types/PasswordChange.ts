/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: PasswordChange
// ====================================================

export interface PasswordChange_passwordChange {
  __typename: "PasswordChange";
  success: boolean | null;
  errors: any | null;
  token: string | null;
  refreshToken: string | null;
}

export interface PasswordChange {
  /**
   * Change account password when user knows the old password.
   * 
   * A new token and refresh token are sent. User must be verified.
   */
  passwordChange: PasswordChange_passwordChange | null;
}

export interface PasswordChangeVariables {
  oldPassword: string;
  newPassword1: string;
  newPassword2: string;
}
