/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Categories
// ====================================================

export interface Categories_categoriesList_content_categories {
  __typename: "Category";
  id: string | null;
  name: string | null;
}

export interface Categories_categoriesList_content {
  __typename: "Category";
  id: string | null;
  name: string | null;
  description: string | null;
  image: string | null;
  categories: (Categories_categoriesList_content_categories | null)[] | null;
}

export interface Categories_categoriesList {
  __typename: "CategoryResult";
  content: (Categories_categoriesList_content | null)[] | null;
}

export interface Categories {
  categoriesList: Categories_categoriesList | null;
}
