import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useProfile, Profile_accountCheckLogged_customer } from "@yownes/api";

interface AuthContextProps {
  isAuthenticated: boolean;
  customer?: Profile_accountCheckLogged_customer | null;
}

const initialState: AuthContextProps = {
  isAuthenticated: false,
  customer: undefined,
};

interface AuthContextActions {
  login: (customer: Profile_accountCheckLogged_customer) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps & AuthContextActions>({
  ...initialState,
  login() {
    return;
  },
  logout() {
    return;
  },
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [state, setState] = useState(initialState);
  const { loading, data } = useProfile();

  useEffect(() => {
    if (!loading) {
      setState((old) => ({
        ...old,
        isAuthenticated: data?.accountCheckLogged?.status === true,
        customer: data?.accountCheckLogged?.customer,
      }));
    }
  }, [loading, data]);

  function login(customer: Profile_accountCheckLogged_customer) {
    setState((old) => ({
      ...old,
      isAuthenticated: true,
      customer,
    }));
  }

  function logout() {
    setState((old) => ({
      ...old,
      isAuthenticated: false,
      customer: null,
    }));
  }

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
