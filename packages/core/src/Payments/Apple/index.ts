import { CartFragment, useCreatePaymentIntent } from "@yownes/api";
import type { ApplePay } from "@stripe/stripe-react-native";
import { useApplePay } from "@stripe/stripe-react-native";

export { ApplePayButton } from "@stripe/stripe-react-native";

export function cartToApplePay(cart: CartFragment): ApplePay.PresentParams {
  return {
    cartItems: [
      { label: cart.total?.label || "", amount: String(cart.total?.amount) },
    ],
    currency: "EUR",
    country: "es",
  };
}

export function useHandleApplePayment(
  cart?: CartFragment | null,
  onSuccess?: () => void
) {
  const { presentApplePay, confirmApplePayPayment, isApplePaySupported } =
    useApplePay();
  const [createPaymentIntent] = useCreatePaymentIntent();
  async function handlePayment() {
    if (cart) {
      const { error, paymentMethod } = await presentApplePay(
        cartToApplePay(cart)
      );
      const { data: intentData } = await createPaymentIntent({
        variables: { paymentMethod: paymentMethod?.id },
      });
      if (intentData?.createPaymentIntent?.clientSecret) {
        const { error: appleError } = await confirmApplePayPayment(
          intentData.createPaymentIntent.clientSecret
        );
        console.log({ appleError });
        if (appleError) {
        } else {
          onSuccess?.();
        }
      }
    }
  }
  return {
    isApplePaySupported,
    handlePayment,
  };
}
