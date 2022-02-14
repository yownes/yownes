import React from "react";
import type { StackScreenProps } from "@react-navigation/stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import type { Product_product } from "@yownes/api";

import Images from "../pages/Products/Images";
import Product from "../pages/Products/Product";

import type { TabsParamList } from "./Root";

export type ProductStackParamList = {
  Product: { id: string; index?: number };
  Images: { product: Product_product; index: number };
};

const ProductStack = createSharedElementStackNavigator<ProductStackParamList>();

export type ProductProps = CompositeScreenProps<
  StackScreenProps<ProductStackParamList, "Product">,
  BottomTabScreenProps<TabsParamList>
>;
export type ImagesProps = StackScreenProps<ProductStackParamList, "Images">;

const ProductNavigator = () => (
  <ProductStack.Navigator
    screenOptions={{
      presentation: "modal",
    }}
    detachInactiveScreens={false}
  >
    <ProductStack.Screen name="Product" component={Product} />
    <ProductStack.Screen
      name="Images"
      component={Images}
      options={{
        headerShown: false,
        cardOverlayEnabled: true,
        gestureEnabled: false,
        cardStyle: { backgroundColor: "transparent" },
      }}
      sharedElements={(route) => {
        const { index, product } =
          route.params as ImagesProps["route"]["params"];
        return [`image.${index}.${product.id}`];
      }}
    />
  </ProductStack.Navigator>
);

export default ProductNavigator;
