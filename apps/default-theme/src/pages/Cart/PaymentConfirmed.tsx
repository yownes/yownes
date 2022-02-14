import React from "react";

import { Box, Button } from "../../components/atoms";
import { Success } from "../../components/images";
import { Placeholder } from "../../components/molecules";
import type { PaymentConfirmedProps } from "../../navigation/Cart";

const PaymentConfirmed = ({ navigation }: PaymentConfirmedProps) => {
  return (
    <Box padding="m">
      <Placeholder View={<Success />} text="Pago realizado con éxito" />
      <Button
        margin="l"
        label="Volver al inicio"
        onPress={() => {
          navigation.reset({ routes: [{ name: "Home" }] });
        }}
      />
    </Box>
  );
};

export default PaymentConfirmed;
