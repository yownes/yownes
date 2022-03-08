/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { TemplateInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: CreateTemplate
// ====================================================

export interface CreateTemplate_createTemplate_template {
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

export interface CreateTemplate_createTemplate {
  __typename: "CreateTemplateMutation";
  ok: boolean | null;
  error: string | null;
  template: CreateTemplate_createTemplate_template | null;
}

export interface CreateTemplate {
  createTemplate: CreateTemplate_createTemplate | null;
}

export interface CreateTemplateVariables {
  template: TemplateInput;
}
