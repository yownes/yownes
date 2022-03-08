/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Templates
// ====================================================

export interface Templates_templates_edges_node {
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

export interface Templates_templates_edges {
  __typename: "TemplateTypeEdge";
  /**
   * The item at the end of the edge
   */
  node: Templates_templates_edges_node | null;
}

export interface Templates_templates {
  __typename: "TemplateTypeConnection";
  /**
   * Contains the nodes in this connection.
   */
  edges: (Templates_templates_edges | null)[];
}

export interface Templates {
  /**
   * List of templates
   */
  templates: Templates_templates | null;
}
