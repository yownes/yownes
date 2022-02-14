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
          {paymentMethod && (
            <Button
              marginTop="m"
              isLoading={loading}
              disabled={loading}
              onPress={handlePayment}
              label="Confirmar Compra"
            />
          )}
        </Box>
      </ScrollView>
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
