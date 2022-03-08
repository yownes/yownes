/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RefreshToken
// ====================================================

export interface RefreshToken_refreshToken {
  __typename: "RefreshToken";
  token: string | null;
  refreshToken: string | null;
  success: boolean | null;
  errors: any | null;
}

export interface RefreshToken {
  /**
   * Same as `grapgql_jwt` implementation, with standard output.
   */
  refreshToken: RefreshToken_refreshToken | null;
}

export interface RefreshTokenVariables {
  refreshToken: string;
}
