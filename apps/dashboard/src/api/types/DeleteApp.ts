/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: DeleteApp
// ====================================================

export interface DeleteApp_deleteApp {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface DeleteApp {
  deleteApp: DeleteApp_deleteApp | null;
}

export interface DeleteAppVariables {
  id: string;
}
