/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { ProductInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdatePlan
// ====================================================

export interface UpdatePlan_updatePlan {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface UpdatePlan {
  updatePlan: UpdatePlan_updatePlan | null;
}

export interface UpdatePlanVariables {
  id: string;
  plan: ProductInput;
}
