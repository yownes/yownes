import React, { Suspense } from "react";
import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";
import { ApolloProvider } from "@apollo/client";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import client from "./lib/apolloClient";
import { AuthProvider } from "./lib/auth";
import { Loading } from "./components/atoms";
import { PrivateRoute } from "./components/molecules";
import Auth from "./pages/auth";
import Dashboard from "./pages/Dashboard";
import Tos from "./pages/Tos";

import "./App.less";

function App() {
  return (
    <ApolloProvider client={client}>
      <ConfigProvider locale={esES}>
        <AuthProvider>
          <Suspense fallback={<Loading />}>
            <Router>
              <Switch>
                <Route path="/auth">
                  <Auth />
                </Route>
                <Route path={"/tos"}>
                  <Tos />
                </Route>
                <PrivateRoute path="/">
                  <Dashboard />
                </PrivateRoute>
              </Switch>
            </Router>
          </Suspense>
        </AuthProvider>
      </ConfigProvider>
    </ApolloProvider>
  );
}

export default App;
