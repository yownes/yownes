import {
  useStripe,
  PaymentIntents,
  useConfirmPayment,
} from "@stripe/stripe-react-native";
import {
  AddPaymentMethod_accountAddPaymentMethod,
  AddressFragment,
  useAddPaymentMethod,
  useConfirmOrder,
  useCreatePaymentIntent,
} from "@yownes/api";

export { CardField } from "@stripe/stripe-react-native";

type UseCreateCardCallback =
  | ((data?: AddPaymentMethod_accountAddPaymentMethod | undefined) => void)
  | undefined;

export function useCreateCard(onSuccess: UseCreateCardCallback) {
  const { createPaymentMethod } = useStripe();
  const [assignPaymentMethod, { loading }] = useAddPaymentMethod({ onSuccess });
  async function create() {
    const result = await createPaymentMethod({ type: "Card" });
    assignPaymentMethod({
      variables: { paymentMethod: result.paymentMethod?.id },
    });
  }

  return [create, { loading }];
}

interface UseHandlePaymentArgs {
  paymentMethodId?: string;
  address?: AddressFragment;
  paymentAddress?: AddressFragment;
  onOrderConfirmed?: () => void;
}
export async function useHandlePayment({
  paymentMethodId,
  address,
  paymentAddress,
  onOrderConfirmed,
}: UseHandlePaymentArgs) {
  const [createPaymentIntent, { loading }] = useCreatePaymentIntent();
  const [confirmOrder, { loading: loadingOrder }] = useConfirmOrder();
  const { confirmPayment, loading: loadingConfirm } = useConfirmPayment();

  async function finishCheckout() {
    const { data: dataOrder } = await confirmOrder({
      variables: {
        paymentAddress: paymentAddress ? paymentAddress?.id : address?.id,
        shippingAddress: address?.id,
      },
    });
    if (dataOrder?.confirmOrder?.order?.id) {
      onOrderConfirmed?.();
    }
  }
  async function handlePayment() {
    if (paymentMethodId) {
      const { data: dataIntent } = await createPaymentIntent({
        variables: { paymentMethod: paymentMethodId },
      });
      if (dataIntent?.createPaymentIntent?.clientSecret) {
        const confirmation = await confirmPayment(
          dataIntent?.createPaymentIntent?.clientSecret,
          {
            paymentMethodId: paymentMethodId,
            type: "Card",
          }
        );

        if (
          confirmation.paymentIntent?.status === PaymentIntents.Status.Succeeded
        ) {
          finishCheckout();
        }
      }
    }
  }
  return [
    handlePayment,
    { loading: loading || loadingConfirm || loadingOrder },
  ];
}
