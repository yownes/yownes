/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: VerifyToken
// ====================================================

export interface VerifyToken_verifyToken {
  __typename: "VerifyToken";
  payload: any | null;
  success: boolean | null;
  errors: any | null;
}

export interface VerifyToken {
  /**
   * Same as `grapgql_jwt` implementation, with standard output.
   */
  verifyToken: VerifyToken_verifyToken | null;
}

export interface VerifyTokenVariables {
  token: string;
}
