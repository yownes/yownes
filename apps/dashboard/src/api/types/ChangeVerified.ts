/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: ChangeVerified
// ====================================================

export interface ChangeVerified_changeVerified {
  __typename: "ChangeVerifiedMutation";
  ok: boolean | null;
  error: string | null;
  verified: boolean | null;
}

export interface ChangeVerified {
  changeVerified: ChangeVerified_changeVerified | null;
}

export interface ChangeVerifiedVariables {
  verify: boolean;
  userId: string;
}
