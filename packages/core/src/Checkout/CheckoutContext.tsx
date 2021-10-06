import React, { createContext, ReactNode, useContext, useState } from "react";
import {
  useGetCart,
  AddressFragment,
  CartFragment,
  PaymentMethodFragment,
} from "@yownes/api";

interface CheckoutContextProps {
  cart?: CartFragment | null;
  paymentMethod?: PaymentMethodFragment;
  address?: AddressFragment;
  paymentAddress?: AddressFragment;
  setPaymentMethod?: React.Dispatch<
    React.SetStateAction<PaymentMethodFragment | undefined>
  >;
  setAddress?: React.Dispatch<
    React.SetStateAction<AddressFragment | undefined>
  >;
  setPaymentAddress?: React.Dispatch<
    React.SetStateAction<AddressFragment | undefined>
  >;
}

const CheckoutContext = createContext<CheckoutContextProps>({});

export const useCheckout = () => useContext(CheckoutContext);

interface CheckoutProviderProps {
  children: ReactNode;
}

export const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const { data } = useGetCart();
  const [address, setAddress] = useState<AddressFragment>();
  const [paymentAddress, setPaymentAddress] = useState<AddressFragment>();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodFragment>();
  return (
    <CheckoutContext.Provider
      value={{
        paymentMethod,
        address,
        setAddress,
        setPaymentMethod,
        paymentAddress,
        setPaymentAddress,
        cart: data?.cart,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
};
