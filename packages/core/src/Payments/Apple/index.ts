import { CartFragment } from "@yownes/api";
import type { ApplePay } from "@stripe/stripe-react-native";

export function cartToApplePay(cart: CartFragment): ApplePay.PresentParams {
  return {
    cartItems: [
      { label: cart.total?.label || "", amount: String(cart.total?.amount) },
    ],
    currency: "EUR",
    country: "es",
  };
}

export { ApplePayButton, useApplePay } from "@stripe/stripe-react-native";
