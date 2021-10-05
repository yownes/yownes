import React from "react";
import { ApolloProvider } from "@apollo/client";

import { getClient } from "./apollo-client";

interface ApiProviderProps {
  children: React.ReactElement;
  uri: string;
}

export const ApiProvider = ({ children, uri }: ApiProviderProps) => {
  const client = getClient(uri);
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
