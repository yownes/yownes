/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: BanUser
// ====================================================

export interface BanUser_banUser {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface BanUser {
  banUser: BanUser_banUser | null;
}

export interface BanUserVariables {
  ban: boolean;
  userId: string;
}
