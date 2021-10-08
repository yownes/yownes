import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";

interface StripeConf {
  publishableKey: string;
  merchantIdentifier: string;
}

interface PaymentsProviderProps {
  children: React.ReactElement;
  stripe: StripeConf;
}

export function PaymentsProvider({ children, stripe }: PaymentsProviderProps) {
  return (
    <StripeProvider
      publishableKey={stripe.publishableKey}
      merchantIdentifier={stripe.merchantIdentifier}
    >
      {children}
    </StripeProvider>
  );
}
