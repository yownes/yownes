/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Template
// ====================================================

export interface Template_template {
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

export interface Template {
  /**
   * The ID of the object
   */
  template: Template_template | null;
}

export interface TemplateVariables {
  id: string;
}
