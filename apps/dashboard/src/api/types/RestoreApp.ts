/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: RestoreApp
// ====================================================

export interface RestoreApp_restoreApp {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface RestoreApp {
  restoreApp: RestoreApp_restoreApp | null;
}

export interface RestoreAppVariables {
  id: string;
}
