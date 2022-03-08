/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { StoreAppInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateApp
// ====================================================

export interface UpdateApp_updateApp {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface UpdateApp {
  updateApp: UpdateApp_updateApp | null;
}

export interface UpdateAppVariables {
  data: StoreAppInput;
  id: string;
}
