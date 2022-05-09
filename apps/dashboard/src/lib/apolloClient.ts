import { ApolloClient, InMemoryCache, concat } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { createUploadLink } from "apollo-upload-client";

import { getToken } from "./auth";

const cache = new InMemoryCache({
  typePolicies: {
    BuildType: {
      fields: {
        date: {
          read(existing) {
            return new Date(existing);
          },
        },
      },
    },
  },
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
      console.log(locations);
    });
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});

const uri = `${import.meta.env.VITE_ENDPOINT_URL}${
  (window as any).__TOKEN__ ? `&${(window as any).__TOKEN__}` : ""
}`;

const httpLink = createUploadLink({
  uri,
});

const authLink = setContext((_, { headers }) => {
  const token = getToken();

  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: errorLink.concat(concat(authLink, httpLink)),
  cache,
});

export default client;
