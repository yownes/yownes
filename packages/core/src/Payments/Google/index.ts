import type { CartFragment } from "@yownes/api";
import { useCreatePaymentIntent } from "@yownes/api";
import { useGooglePay } from "@stripe/stripe-react-native";

export { GooglePayButton } from "@stripe/stripe-react-native";

export function useHandleGooglePayment(
  cart?: CartFragment | null,
  onSuccess?: () => void
) {
  const { presentGooglePay } = useGooglePay();
  const [createPaymentIntent] = useCreatePaymentIntent();

  async function handlePayment() {
    const { data: intentData } = await createPaymentIntent();
    if (intentData?.createPaymentIntent?.clientSecret) {
      const { error } = await presentGooglePay({
        currencyCode: "EUR",
        clientSecret: intentData?.createPaymentIntent?.clientSecret,
      });
      if (error) {
        console.log({ googleError: error });
      } else {
        onSuccess?.();
      }
    }
  }

  return {
    handlePayment,
  };
}
