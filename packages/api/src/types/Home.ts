/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Home
// ====================================================

export interface Home_home_meta {
  __typename: "Meta";
  title: string | null;
  description: string | null;
}

export interface Home_home_slides_slides_size {
  __typename: "SlideImageSize";
  width: number | null;
  height: number | null;
}

export interface Home_home_slides_slides {
  __typename: "Slide";
  id: string | null;
  imageUrl: string | null;
  title: string | null;
  description: string | null;
  size: Home_home_slides_slides_size | null;
}

export interface Home_home_slides {
  __typename: "SlidesResult";
  speed: number | null;
  slides: (Home_home_slides_slides | null)[] | null;
}

export interface Home_home {
  __typename: "HomeResult";
  meta: Home_home_meta | null;
  banner: string | null;
  slides: Home_home_slides | null;
}

export interface Home_latestProducts_content {
  __typename: "Product";
  id: string | null;
  name: string | null;
  price: string | null;
  special: string | null;
  image: string | null;
  manufacturer: string | null;
}

export interface Home_latestProducts {
  __typename: "ProductResult";
  content: (Home_latestProducts_content | null)[] | null;
}

export interface Home_specialProducts_content {
  __typename: "Product";
  id: string | null;
  name: string | null;
  price: string | null;
  special: string | null;
  image: string | null;
  manufacturer: string | null;
}

export interface Home_specialProducts {
  __typename: "ProductResult";
  content: (Home_specialProducts_content | null)[] | null;
}

export interface Home_bestSells {
  __typename: "Product";
  id: string | null;
  name: string | null;
  price: string | null;
  special: string | null;
  image: string | null;
  manufacturer: string | null;
}

export interface Home {
  home: Home_home | null;
  latestProducts: Home_latestProducts | null;
  specialProducts: Home_specialProducts | null;
  bestSells: (Home_bestSells | null)[] | null;
}
