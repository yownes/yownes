import { useLazyQuery, useQuery } from "@apollo/client";

import {
  ABOUT,
  ADDRESS_LIST,
  CARRIER_LIST,
  CART,
  CATEGORIES,
  COUNTRIES_LIST,
  FAVOURITES,
  HOME,
  ORDER,
  ORDERS,
  PAYMENT_METHOD_LIST,
  PRODUCT,
  PRODUCTS,
  PROFILE,
  TOP_SALES,
  ZONES_LIST,
} from "../definitions/queries";
import type { About } from "../types/About";
import type { AddressList } from "../types/AddressList";
import type { CarrierList } from "../types/CarrierList";
import type { Cart } from "../types/Cart";
import type { Categories } from "../types/Categories";
import type { CountriesList } from "../types/CountriesList";
import type { Favourites } from "../types/Favourites";
import type { Home } from "../types/Home";
import type { Order, OrderVariables } from "../types/Order";
import type { Orders } from "../types/Orders";
import type { PaymentMethodList } from "../types/PaymentMethodList";
import type { Product, ProductVariables } from "../types/Product";
import type { Products, ProductsVariables } from "../types/Products";
import type { Profile } from "../types/Profile";
import type { TopSales } from "../types/TopSales";
import type { ZonesList, ZonesListVariables } from "../types/ZonesList";

export function useGetCountries() {
  return useQuery<CountriesList>(COUNTRIES_LIST);
}
export function useGetZones(countryId: ZonesListVariables["countryId"]) {
  return useQuery<ZonesList, ZonesListVariables>(ZONES_LIST, {
    variables: { countryId },
  });
}
export function useGetCarriers() {
  return useQuery<CarrierList>(CARRIER_LIST);
}
export function useProfile() {
  return useQuery<Profile>(PROFILE);
}
export function useGetCart() {
  return useQuery<Cart>(CART);
}
export function useGetAddresses() {
  return useQuery<AddressList>(ADDRESS_LIST);
}
export function useGetTopSales() {
  return useQuery<TopSales>(TOP_SALES);
}
export function useGetFavourites() {
  return useQuery<Favourites>(FAVOURITES);
}
export function useGetPaymentMethods() {
  return useQuery<PaymentMethodList>(PAYMENT_METHOD_LIST);
}
export function useGetCategories() {
  return useQuery<Categories>(CATEGORIES);
}
export function useGetLazyProducts() {
  return useLazyQuery<Products, ProductsVariables>(PRODUCTS);
}
export function useGetProducts(variables: ProductsVariables) {
  return useQuery<Products, ProductsVariables>(PRODUCTS, { variables });
}
export function useGetOrders() {
  return useQuery<Orders>(ORDERS);
}
export function useGetOrder(id: OrderVariables["id"]) {
  return useQuery<Order, OrderVariables>(ORDER, {
    variables: { id },
  });
}
export function useGetAbout() {
  return useQuery<About>(ABOUT);
}
export function useGetHome() {
  return useQuery<Home>(HOME);
}
export function useGetProduct(id: ProductVariables["id"]) {
  return useQuery<Product, ProductVariables>(PRODUCT, {
    variables: { id },
  });
}
