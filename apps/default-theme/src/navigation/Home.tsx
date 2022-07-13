import type { StackScreenProps } from "@react-navigation/stack";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import About from "../pages/About";
import Home from "../pages/Home";

export type HomeStackParamList = {
  HomeScreen: undefined;
  About: undefined;
};

export type HomeProps = StackScreenProps<HomeStackParamList, "HomeScreen">;
export type AboutProps = StackScreenProps<HomeStackParamList, "About">;

const HomeStack = createStackNavigator<HomeStackParamList>();

const HomeNavigator = () => {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerTitleStyle: { textTransform: "uppercase" },
      }}
    >
      <HomeStack.Screen
        name="HomeScreen"
        options={{ headerShown: false }}
        component={Home}
      />
      <HomeStack.Screen
        name="About"
        component={About}
        options={{ title: "Sobre nosotros" }}
      />
    </HomeStack.Navigator>
  );
};

export default HomeNavigator;
