import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

export interface RoutePath {
  exact: boolean;
  path: string;
  redirect?: string;
  component?: () => JSX.Element;
  name?: string;
  admin?: boolean;
}

interface RouterProps {
  routes: RoutePath[];
}

const Router = ({ routes }: RouterProps) => {
  return (
    <Switch>
      {routes.map((MyRoute) => (
        <Route key={MyRoute.path} exact={MyRoute.exact} path={MyRoute.path}>
          {MyRoute.redirect ? (
            <Redirect to={{ pathname: MyRoute.redirect }} />
          ) : (
            MyRoute.component && <MyRoute.component />
          )}
        </Route>
      ))}
    </Switch>
  );
};

export default Router;
