/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { BuildBuildStatus } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: GenerateApp
// ====================================================

export interface GenerateApp_generateApp_build {
  __typename: "BuildType";
  /**
   * The ID of the object.
   */
  id: string;
  buildStatus: BuildBuildStatus;
  date: any;
}

export interface GenerateApp_generateApp {
  __typename: "GenerateAppMutation";
  ok: boolean | null;
  error: string | null;
  build: GenerateApp_generateApp_build | null;
}

export interface GenerateApp {
  generateApp: GenerateApp_generateApp | null;
}

export interface GenerateAppVariables {
  appId: string;
}
