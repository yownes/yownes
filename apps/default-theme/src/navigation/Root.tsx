import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import type { StackScreenProps } from "@react-navigation/stack";
import type { Categories_categoriesList_content_categories } from "@yownes/api";
import type { NavigatorScreenParams } from "@react-navigation/native";
import { useNavigation as useNativeNavigation } from "@react-navigation/native";

import Categories from "../pages/Categories/Categories";
import ProductsPage from "../pages/Products/Products";
import {
  HomeOutlined,
  Home as HomeIcon,
  CategoriesOutlined,
  Categories as CategoriesIcon,
  CartOutlined,
  Cart as CartIcon,
  ProfileOutlined,
  Profile as ProfileIcon,
} from "../components/icons";
import { useTheme } from "../lib/theme";

import type { ProfileStackParamList } from "./Profile";
import Profile from "./Profile";
import type { HomeStackParamList } from "./Home";
import Home from "./Home";
import type { CartStackParamList } from "./Cart";
import Cart from "./Cart";
import type { ProductStackParamList } from "./Product";
import Product from "./Product";

export type TabsParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Categorías: undefined;
  Carrito: NavigatorScreenParams<CartStackParamList>;
  Perfil: NavigatorScreenParams<ProfileStackParamList>;
};

type AppStackParamList = {
  App: NavigatorScreenParams<TabsParamList>;
  Products: { category?: Categories_categoriesList_content_categories };
  ProductStack: NavigatorScreenParams<ProductStackParamList>;
};

export type ProductsProps = StackScreenProps<AppStackParamList, "Products">;
export type AppProps = StackScreenProps<AppStackParamList>;

const Tab = createBottomTabNavigator<TabsParamList>();
const Stack = createSharedElementStackNavigator<AppStackParamList>();

export const useNavigation = () =>
  useNativeNavigation<AppProps["navigation"]>();

const Root = () => {
  const theme = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.dark,
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon({ focused, size }) {
            return focused ? (
              <HomeIcon size={size} color="primary" />
            ) : (
              <HomeOutlined size={size} color="dark" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Categorías"
        component={Categories}
        options={{
          tabBarIcon({ focused, size }) {
            return focused ? (
              <CategoriesIcon size={size} color="primary" />
            ) : (
              <CategoriesOutlined size={size} color="dark" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Carrito"
        component={Cart}
        options={{
          tabBarIcon({ focused, size }) {
            return focused ? (
              <CartIcon size={size} color="primary" />
            ) : (
              <CartOutlined size={size} color="dark" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Profile}
        options={{
          tabBarIcon({ focused, size }) {
            return focused ? (
              <ProfileIcon size={size} color="primary" />
            ) : (
              <ProfileOutlined size={size} color="dark" />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="App"
        options={{ headerShown: false }}
        component={Root}
      />
      <Stack.Screen
        name="ProductStack"
        options={{ headerShown: false }}
        component={Product}
      />
      <Stack.Screen
        name="Products"
        component={ProductsPage}
        options={({ route }) => ({
          title: route.params.category?.name ?? "Productos",
        })}
      />
    </Stack.Navigator>
  );
};

export default App;
