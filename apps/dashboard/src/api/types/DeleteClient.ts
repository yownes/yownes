/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteClient
// ====================================================

export interface DeleteClient_deleteClient {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface DeleteClient {
  deleteClient: DeleteClient_deleteClient | null;
}

export interface DeleteClientVariables {
  active: boolean;
  userId: string;
}
