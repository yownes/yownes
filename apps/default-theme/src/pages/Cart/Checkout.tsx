import React, { useRef } from "react";
import { ScrollView } from "react-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { CheckoutProvider, useCheckout, useHandlePayment } from "@yownes/core";

import { Box, Button } from "../../components/atoms";
import {
  DeliverySelect,
  PaymentSelect,
  ShippingSelect,
} from "../../components/organisms";
import type { CheckoutProps } from "../../navigation/Cart";

import Summary from "./Components/Summary";

const CheckoutContent = ({ navigation }: CheckoutProps) => {
  const scrollView = useRef<ScrollView>(null);
  const { paymentMethod, address, paymentAddress, cart } = useCheckout();
  const { handlePayment, finishCheckout, loading } = useHandlePayment({
    paymentAddress,
    address,
    paymentMethodId: paymentMethod?.id ?? undefined,
    onOrderConfirmed: () => {
      navigation.replace("PaymentConfirmed");
    },
  });

  return (
    <BottomSheetModalProvider>
      <ScrollView ref={scrollView}>
        <Box padding="m">
          {cart && <Summary cart={cart} />}
          {cart?.deliveryOption && (
            <Box marginTop="m">
              <DeliverySelect selected={cart?.deliveryOption} />
            </Box>
          )}
          <Box marginTop="m">
            <ShippingSelect />
          </Box>
          <Box marginTop="m">
            <PaymentSelect
              scrollView={scrollView}
              finishCheckout={finishCheckout}
            />
          </Box>
        </Box>
      </ScrollView>
      <Box
        backgroundColor="white"
        shadowColor="black"
        shadowOpacity={0.2}
        shadowOffset={{ width: 0, height: 5 }}
        shadowRadius={15}
        elevation={5}
      >
        <Button
          label={`Pagar (${cart?.total?.value})`}
          isLoading={loading}
          disabled={loading || (paymentMethod ? false : true)}
          onPress={handlePayment}
          marginHorizontal="l"
          marginVertical="m"
        />
      </Box>
    </BottomSheetModalProvider>
  );
};

const Checkout = (props: CheckoutProps) => {
  return (
    <CheckoutProvider>
      <CheckoutContent {...props} />
    </CheckoutProvider>
  );
};

export default Checkout;
