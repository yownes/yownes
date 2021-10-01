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
  PRODUCTS,
  PROFILE,
  TOP_SALES,
  ZONES_LIST,
} from "../definitions/queries";
import { About } from "../types/About";
import { AddressList } from "../types/AddressList";
import { CarrierList } from "../types/CarrierList";
import { Cart } from "../types/Cart";
import { Categories } from "../types/Categories";
import { CountriesList } from "../types/CountriesList";
import { Favourites } from "../types/Favourites";
import { Home } from "../types/Home";
import { Order, OrderVariables } from "../types/Order";
import { Orders } from "../types/Orders";
import { PaymentMethodList } from "../types/PaymentMethodList";
import { Products, ProductsVariables } from "../types/Products";
import { Profile } from "../types/Profile";
import { TopSales } from "../types/TopSales";
import { ZonesList } from "../types/ZonesList";

export function useGetCountries() {
  return useQuery<CountriesList>(COUNTRIES_LIST);
}
export function useGetZones(countryId: string) {
  return useQuery<ZonesList>(ZONES_LIST, {
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
