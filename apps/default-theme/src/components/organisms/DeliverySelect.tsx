import React from "react";
import { TouchableOpacity } from "react-native";
import { useSetDeliverOption, useGetCarriers } from "@yownes/api";

import { Card, Text, Box, RadioButton } from "../atoms";

interface DeliverySelectProps {
  selected: string;
}

const DeliverySelect = ({ selected }: DeliverySelectProps) => {
  const { data } = useGetCarriers();
  const [setDeliveryOption] = useSetDeliverOption();
  return (
    <Card padding="l">
      <Text marginBottom="l">Método de envío</Text>
      {data?.carrierList?.map((carrier) => (
        <TouchableOpacity
          key={carrier?.id}
          onPress={() => {
            if (carrier?.reference) {
              setDeliveryOption({
                variables: { option: carrier.reference },
              });
            }
          }}
        >
          <Box flexDirection="row" alignItems="center">
            <RadioButton active={selected === carrier?.reference} />
            <Box flex={1} padding="m">
              <Text variant="header3">{carrier?.name}</Text>
              <Box flexDirection="row" justifyContent="space-between">
                <Text>{carrier?.delay}</Text>
                <Text>{carrier?.price}</Text>
              </Box>
            </Box>
          </Box>
        </TouchableOpacity>
      ))}
    </Card>
  );
};

export default DeliverySelect;
