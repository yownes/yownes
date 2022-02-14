import "react-native-gesture-handler";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { ThemeProvider } from "@shopify/restyle";
import Constants from "expo-constants";
import { ApiProvider } from "@yownes/api";
import { AuthProvider, PaymentsProvider } from "@yownes/core";

import Root from "./src/navigation/Root";
import theme from "./src/lib/theme";

const uri = `${Constants.manifest?.extra?.apiUrl}/module/yownes/graphql`;
// console.log(uri);

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <ApiProvider uri={uri}>
          <AuthProvider>
            <PaymentsProvider
              stripe={{
                publishableKey: Constants.manifest?.extra?.stripeKey,
                merchantIdentifier: "merchant.com.yownes.test",
              }}
            >
              <NavigationContainer>
                <Root />
              </NavigationContainer>
            </PaymentsProvider>
          </AuthProvider>
        </ApiProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
