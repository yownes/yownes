/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: UpdateBuildsLimit
// ====================================================

export interface UpdateBuildsLimit_updateBuildsLimit {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface UpdateBuildsLimit {
  updateBuildsLimit: UpdateBuildsLimit_updateBuildsLimit | null;
}

export interface UpdateBuildsLimitVariables {
  limit: number;
}
