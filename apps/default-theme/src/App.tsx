import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@shopify/restyle";
import Constants from "expo-constants";
import { ApiProvider } from "@yownes/api";
// import { AuthProvider, PaymentsProvider } from "@yownes/core";

import Root from "./navigation/Root";
import theme from "./lib/theme";

const uri = `${Constants.manifest?.extra?.apiUrl}/module/yownes/graphql`;
console.log(uri);

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <ApiProvider uri={uri}>
          {/* <AuthProvider>
            <PaymentsProvider
              stripe={{
                publishableKey: Constants.manifest?.extra?.stripeKey,
                merchantIdentifier: "merchant.com.yownes.test",
              }}
            > */}
          <NavigationContainer>
            <Root />
          </NavigationContainer>
          {/* </PaymentsProvider>
          </AuthProvider> */}
        </ApiProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default App;
