/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Products
// ====================================================

export interface Products_productsList_content {
  __typename: "Product";
  id: string | null;
  name: string | null;
  price: string | null;
  special: string | null;
  image: string | null;
  manufacturer: string | null;
}

export interface Products_productsList_facets_filters {
  __typename: "FacetFilter";
  label: string | null;
  type: string | null;
  value: string | null;
  active: boolean | null;
}

export interface Products_productsList_facets {
  __typename: "Facet";
  label: string | null;
  type: string | null;
  multipleSelectionAllowed: boolean | null;
  widgetType: string | null;
  filters: (Products_productsList_facets_filters | null)[] | null;
}

export interface Products_productsList_sortOrders {
  __typename: "SortOrder";
  entity: string | null;
  label: string | null;
  field: string | null;
  direction: string | null;
}

export interface Products_productsList {
  __typename: "ProductResult";
  last: boolean | null;
  totalPages: number | null;
  content: (Products_productsList_content | null)[] | null;
  facets: (Products_productsList_facets | null)[] | null;
  sortOrders: (Products_productsList_sortOrders | null)[] | null;
}

export interface Products {
  productsList: Products_productsList | null;
}

export interface ProductsVariables {
  category?: string | null;
  page?: number | null;
  search?: string | null;
  filter?: string | null;
  sort?: string | null;
  order?: string | null;
}
