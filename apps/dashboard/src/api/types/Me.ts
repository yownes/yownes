/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Me
// ====================================================

export interface Me_me {
  __typename: "UserNode";
  /**
   * The ID of the object.
   */
  id: string;
  email: string;
  /**
   * Requerido. 150 carácteres como máximo. Únicamente letras, dígitos y @/./+/-/_ 
   */
  username: string;
  /**
   * Indica si el usuario puede entrar en este sitio de administración.
   */
  isStaff: boolean;
}

export interface Me {
  me: Me_me | null;
}
