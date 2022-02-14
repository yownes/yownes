import React, { useEffect, useState } from "react";
import type { ScrollView } from "react-native";
import { Alert } from "react-native";
import {
  useGetPaymentMethods,
  CartFragment,
  useCreatePaymentIntent,
} from "@yownes/api";
import {
  useCheckout,
  ApplePayButton,
  useHandleApplePayment,
} from "@yownes/core";
// import {
//   useGooglePay,
//   GooglePayButton,
//   initGooglePay,
// } from "@stripe/stripe-react-native";

// export function useHandleGooglePayment(
//   cart?: CartFragment | null,
//   onSuccess?: () => void
// ) {
//   const { presentGooglePay } = useGooglePay();
//   const [createPaymentIntent] = useCreatePaymentIntent();
//   const [init, setInit] = useState(false);

//   useEffect(() => {
//     async function initilize() {
//       const { error } = await initGooglePay({
//         testEnv: true,
//         countryCode: "ES",
//         merchantName: "Test",
//         existingPaymentMethodRequired: false,
//       });
//       if (error) {
//         Alert.alert(error.code, error.message);
//         return;
//       }
//       setInit(true);
//     }
//     initilize();
//   }, []);

//   async function handlePayment() {
//     const { data: intentData } = await createPaymentIntent();
//     if (intentData?.createPaymentIntent?.clientSecret) {
//       const { error } = await presentGooglePay({
//         clientSecret: intentData?.createPaymentIntent?.clientSecret,
//         forSetupIntent: false,
//       });
//     }
//   }

//   return {
//     handlePayment,
//     isGooglePayEnabled: init,
//   };
// }

import { Button, Card, Text } from "../atoms";

import CardSelect from "./CardSelect";

interface PaymentSelectProps {
  finishCheckout: () => Promise<void>;
  scrollView: React.RefObject<ScrollView>;
}

const PaymentSelect = ({ scrollView, finishCheckout }: PaymentSelectProps) => {
  const [method, setMethod] = useState(false);
  const { cart } = useCheckout();
  const { data } = useGetPaymentMethods();
  const { handlePayment, isApplePaySupported } = useHandleApplePayment(
    cart,
    finishCheckout
  );
  // const {
  //   handlePayment: handleGPay,
  //   isGooglePayEnabled,
  // } = useHandleGooglePayment(cart, finishCheckout);
  useEffect(() => {
    if (method) {
      setTimeout(() => {
        scrollView.current?.scrollToEnd();
        // a(time - interval, interval, cadence);
      }, 50);
    }
  }, [method, scrollView]);

  return (
    <Card padding="l">
      <Text marginBottom="l">Método de pago</Text>
      {method ? (
        <CardSelect
          cards={data?.accountPaymentMethodList}
          onCancel={() => setMethod(false)}
        />
      ) : (
        <>
          <Button
            label="Tarjeta"
            onPress={() => {
              setMethod(true);
            }}
          />
          {isApplePaySupported && (
            <ApplePayButton
              type="plain"
              buttonStyle="black"
              borderRadius={4}
              style={{
                width: "100%",
                height: 40,
                marginTop: 10,
                alignSelf: "center",
              }}
              onPress={handlePayment}
            />
          )}
          {/* {isGooglePayEnabled && (
            <GooglePayButton
              disabled={isGooglePayEnabled}
              onPress={handleGPay}
            />
          )} */}
        </>
      )}
    </Card>
  );
};

export default PaymentSelect;
