/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Product
// ====================================================

export interface Product_product_images {
  __typename: "productImage";
  imageBig: string | null;
}

export interface Product_product_attributes {
  __typename: "productAttribute";
  name: string | null;
  options: (string | null)[] | null;
}

export interface Product_product_options_values {
  __typename: "OptionValue";
  id: string | null;
  name: string | null;
}

export interface Product_product_options {
  __typename: "ProductOption";
  name: string | null;
  type: string | null;
  values: (Product_product_options_values | null)[] | null;
}

export interface Product_product {
  __typename: "Product";
  id: string | null;
  name: string | null;
  image: string | null;
  images: (Product_product_images | null)[] | null;
  shortDescription: string | null;
  description: string | null;
  price: string | null;
  special: string | null;
  stock: number | null;
  inWishlist: boolean | null;
  manufacturer: string | null;
  attributes: (Product_product_attributes | null)[] | null;
  options: (Product_product_options | null)[] | null;
}

export interface Product {
  product: Product_product | null;
}

export interface ProductVariables {
  id?: string | null;
}
