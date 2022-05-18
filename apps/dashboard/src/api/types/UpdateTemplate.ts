/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TemplateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: UpdateTemplate
// ====================================================

export interface UpdateTemplate_updateTemplate_template {
  __typename: "TemplateType";
  /**
   * The ID of the object.
   */
  id: string;
  isActive: boolean;
  name: string;
  previewImg: string | null;
  /**
   * Link to Git repository of the template
   */
  url: string | null;
  /**
   * Expo Snack ID
   */
  snack: string | null;
}

export interface UpdateTemplate_updateTemplate {
  __typename: "UpdateTemplateMutation";
  ok: boolean | null;
  error: string | null;
  template: UpdateTemplate_updateTemplate_template | null;
}

export interface UpdateTemplate {
  updateTemplate: UpdateTemplate_updateTemplate | null;
}

export interface UpdateTemplateVariables {
  id: string;
  template: TemplateInput;
}
