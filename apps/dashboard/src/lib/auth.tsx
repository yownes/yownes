import React, { useEffect, createContext, useContext, useReducer } from "react";
import { useMutation, useLazyQuery, useApolloClient } from "@apollo/client";

import { REFRESH_TOKEN, REGISTER, TOKEN_AUTH } from "../api/mutations";
import { ME } from "../api/queries";
import type { Me, Me_me } from "../api/types/Me";
import type {
  RefreshToken,
  RefreshTokenVariables,
} from "../api/types/RefreshToken";
import type { Register, RegisterVariables } from "../api/types/Register";
import type { TokenAuth, TokenAuthVariables } from "../api/types/TokenAuth";
import { Loading } from "../components/atoms";

export const TOKEN_KEY = "yownesToken";

interface Error {
  code: string;
  message: string;
}

interface Token {
  token: string;
  expiry: number;
}

export interface Errors {
  nonFieldErrors?: Error[];
  [key: string]: Error[] | undefined;
}

interface AuthState {
  isAdmin: boolean;
  token?: Token;
  loading: boolean;
  loadingAuth: boolean;
  loadingRegister: boolean;
  errors?: Errors;
  user?: Me_me;
  isAuthenticated: boolean;
}

interface IAuth extends AuthState {
  login: (variables: TokenAuthVariables) => Promise<void>;
  register: (variables: RegisterVariables) => Promise<void>;
  logout: () => void;
  setNewToken: (token: string, refreshToken: string) => void;
  clear: () => void;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

type AuthStateAction =
  | {
      type: "LOGIN";
      payload: {
        isAdmin?: boolean;
        token?: Token;
        user?: Me_me;
      };
    }
  | {
      type: "TOKEN";
      payload: Token;
    }
  | {
      type: "LOADING";
      payload: boolean;
    }
  | {
      type: "ERROR";
      payload: Errors;
    }
  | {
      type: "LOGOUT";
    }
  | {
      type: "CLEAR_ERRORS";
    };

const AuthContext = createContext<Partial<IAuth>>({});

export const useAuth = () => useContext(AuthContext);

const initialState: AuthState = {
  loading: true,
  loadingAuth: false,
  loadingRegister: false,
  isAdmin: false,
  isAuthenticated: false,
  user: undefined,
};

let inMemoryToken: string;

export function getToken() {
  return inMemoryToken;
}

function reducer(state: AuthState, action: AuthStateAction): AuthState {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "ERROR":
      return {
        ...state,
        errors: action.payload,
        loading: false,
        isAuthenticated: false,
      };
    case "TOKEN":
      inMemoryToken = action.payload.token;
      return {
        ...state,
        token: action.payload,
      };
    case "LOGIN":
      if (action.payload.token) {
        inMemoryToken = action.payload.token.token;
      }
      return {
        ...state,
        isAdmin: action.payload.isAdmin || false,
        loading: false,
        token: action.payload.token ?? state.token,
        user: action.payload.user,
        isAuthenticated: inMemoryToken ? true : !!state.token,
      };
    case "LOGOUT":
      return { ...initialState, loading: false };
    case "CLEAR_ERRORS":
      return {
        ...state,
        errors: undefined,
      };
    default:
      return state;
  }
}

function parseToken(token: string): Token {
  const payload = JSON.parse(atob(token.split(".")[1]));
  const expiry = payload.exp;
  return {
    token,
    expiry,
  };
}

function useAuthLogic(): IAuth {
  const apolloClient = useApolloClient();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [tokenAuth, { loading: loadAuth }] = useMutation<
    TokenAuth,
    TokenAuthVariables
  >(TOKEN_AUTH);
  const [registerMutation, { loading: loadReg }] = useMutation<
    Register,
    RegisterVariables
  >(REGISTER);
  const [refreshTokenMutation] = useMutation<
    RefreshToken,
    RefreshTokenVariables
  >(REFRESH_TOKEN);
  const [me] = useLazyQuery<Me>(ME, {
    onCompleted({ me: m }) {
      if (m) {
        dispatch({
          type: "LOGIN",
          payload: { isAdmin: m?.isStaff, user: m },
        });
      }
    },
  });

  async function login(variables: TokenAuthVariables) {
    const { data } = await tokenAuth({
      variables,
    });
    if (data?.tokenAuth?.success && data.tokenAuth.token) {
      if (data.tokenAuth.refreshToken) {
        localStorage.setItem(TOKEN_KEY, data.tokenAuth.refreshToken);
      }
      const token = parseToken(data.tokenAuth.token);
      setTimeout(refreshToken, token.expiry * 1000 - new Date().getTime());
      if (data.tokenAuth.user) {
        dispatch({
          type: "LOGIN",
          payload: {
            token,
            isAdmin: data.tokenAuth.user?.isStaff ?? false,
            user: data.tokenAuth.user,
          },
        });
      }
    } else {
      //TODO: Error handling
      dispatch({ type: "ERROR", payload: data?.tokenAuth?.errors });
    }
  }

  async function register(variables: RegisterVariables) {
    const { data } = await registerMutation({
      variables,
    });
    if (data?.register?.success && data.register.token) {
      if (data.register.refreshToken) {
        localStorage.setItem(TOKEN_KEY, data.register.refreshToken);
      }
      dispatch({
        type: "LOGIN",
        payload: { token: parseToken(data.register.token) },
      });
    } else {
      //TODO: Error handling
      dispatch({ type: "ERROR", payload: data?.register?.errors });
    }
  }

  function logout() {
    setTimeout(() => {
      localStorage.removeItem(TOKEN_KEY);
      apolloClient.clearStore();
      dispatch({ type: "LOGOUT" });
    }, 200);
  }

  function setNewToken(token: string, refresh: string) {
    localStorage.setItem(TOKEN_KEY, refresh);
    inMemoryToken = token;
  }

  function refreshToken() {
    const thRefreshToken = localStorage.getItem(TOKEN_KEY);
    if (thRefreshToken) {
      refreshTokenMutation({
        variables: { refreshToken: thRefreshToken },
        fetchPolicy: "no-cache",
      }).then(({ data }) => {
        if (data?.refreshToken?.success && data.refreshToken.token) {
          const token = parseToken(data.refreshToken.token);
          const ms = token.expiry * 1000 - new Date().getTime();

          setTimeout(refreshToken, ms);

          dispatch({
            type: "TOKEN",
            payload: token,
          });

          me();

          if (data.refreshToken.refreshToken) {
            localStorage.setItem(TOKEN_KEY, data.refreshToken.refreshToken);
          }
        } else {
          dispatch({ type: "ERROR", payload: data?.refreshToken?.errors });
        }
      });
    }
  }

  function clear() {
    dispatch({ type: "CLEAR_ERRORS" });
  }

  useEffect(() => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (t) {
      refreshToken();
    } else {
      dispatch({ type: "LOADING", payload: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    login,
    logout,
    register,
    setNewToken,
    clear,
    ...state,
    loadingAuth: loadAuth,
    loadingRegister: loadReg,
  };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const auth = useAuthLogic();
  if (auth.loading) {
    return <Loading />;
  }
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
