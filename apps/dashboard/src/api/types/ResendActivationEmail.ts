/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ResendActivationEmail
// ====================================================

export interface ResendActivationEmail_resendActivationEmail {
  __typename: "ResendActivationEmail";
  success: boolean | null;
  errors: any | null;
}

export interface ResendActivationEmail {
  /**
   * Sends activation email.
   * 
   * It is called resend because theoretically
   * the first activation email was sent when
   * the user registered.
   * 
   * If there is no user with the requested email,
   * a successful response is returned.
   */
  resendActivationEmail: ResendActivationEmail_resendActivationEmail | null;
}

export interface ResendActivationEmailVariables {
  email: string;
}
