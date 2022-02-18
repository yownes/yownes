import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { StackScreenProps } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Cart from "../pages/Cart/Cart";
import Checkout from "../pages/Cart/Checkout";
import PaymentConfirmed from "../pages/Cart/PaymentConfirmed";

import type { TabsParamList } from "./Root";

export type CartStackParamList = {
  Cart: undefined;
  Checkout: undefined;
  PaymentConfirmed: undefined;
};

export type CartProps = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList>,
  StackScreenProps<CartStackParamList, "Cart">
>;
export type CheckoutProps = StackScreenProps<CartStackParamList, "Checkout">;
export type PaymentConfirmedProps = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList>,
  StackScreenProps<CartStackParamList, "PaymentConfirmed">
>;

const CartStack = createStackNavigator<CartStackParamList>();

const CartNavigation = () => {
  return (
    <CartStack.Navigator>
      <CartStack.Screen name="Cart" component={Cart} />
      <CartStack.Screen name="Checkout" component={Checkout} />
      <CartStack.Screen name="PaymentConfirmed" component={PaymentConfirmed} />
    </CartStack.Navigator>
  );
};

export default CartNavigation;