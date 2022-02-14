import React from "react";
import type { AddPaymentMethod_accountAddPaymentMethod } from "@yownes/api";
import { useCreateCard, CardField } from "@yownes/core";

import { Button, Box, Card } from "../atoms";

interface AddPaymentMethodProps {
  onSuccess: (paymentMethod?: AddPaymentMethod_accountAddPaymentMethod) => void;
}

const AddPaymentMethod = ({ onSuccess }: AddPaymentMethodProps) => {
  const [createPaymentMethod, { loading }] = useCreateCard(onSuccess);
  return (
    <Box padding="m">
      <Card padding="l">
        <CardField
          style={{ height: 50 }}
          postalCodeEnabled={false}
          dangerouslyGetFullCardDetails
        />
        <Button
          mt="l"
          disabled={loading}
          label="Crear método de pago"
          onPress={createPaymentMethod}
        />
      </Card>
    </Box>
  );
};

export default AddPaymentMethod;
