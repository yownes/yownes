/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: SendPasswordResetEmail
// ====================================================

export interface SendPasswordResetEmail_sendPasswordResetEmail {
  __typename: "SendPasswordResetEmail";
  success: boolean | null;
  errors: any | null;
}

export interface SendPasswordResetEmail {
  /**
   * Send password reset email.
   * 
   * For non verified users, send an activation
   * email instead.
   * 
   * Accepts both primary and secondary email.
   * 
   * If there is no user with the requested email,
   * a successful response is returned.
   */
  sendPasswordResetEmail: SendPasswordResetEmail_sendPasswordResetEmail | null;
}

export interface SendPasswordResetEmailVariables {
  email: string;
}
