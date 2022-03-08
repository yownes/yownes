/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TemplateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTemplate
// ====================================================

export interface UpdateTemplate_updateTemplate {
  __typename: "Return";
  ok: boolean | null;
  error: string | null;
}

export interface UpdateTemplate {
  updateTemplate: UpdateTemplate_updateTemplate | null;
}

export interface UpdateTemplateVariables {
  id: string;
  template: TemplateInput;
}
