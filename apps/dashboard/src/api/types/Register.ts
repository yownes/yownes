/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register {
  __typename: "Register";
  success: boolean | null;
  errors: any | null;
  token: string | null;
  refreshToken: string | null;
}

export interface Register {
  /**
   * Register user with fields defined in the settings.
   * 
   * If the email field of the user model is part of the
   * registration fields (default), check if there is
   * no user with that email or as a secondary email.
   * 
   * If it exists, it does not register the user,
   * even if the email field is not defined as unique
   * (default of the default django user model).
   * 
   * When creating the user, it also creates a `UserStatus`
   * related to that user, making it possible to track
   * if the user is archived, verified and has a secondary
   * email.
   * 
   * Send account verification email.
   * 
   * If allowed to not verified users login, return token.
   */
  register: Register_register | null;
}

export interface RegisterVariables {
  email: string;
  username: string;
  password1: string;
  password2: string;
}
