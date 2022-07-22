import React from "react";
import type { AddressFragment } from "@yownes/api";

import { Box, Card, Text } from "../atoms";
import { Stamp } from "../icons";

interface AddressProps {
  address: AddressFragment;
}

export const ADDRESS_HEIGHT = 150;

const Address = ({ address }: AddressProps) => {
  return (
    <Card
      variant="elevated"
      backgroundColor="greyscale2"
      padding="m"
      flexDirection="row"
      height={ADDRESS_HEIGHT}
    >
      <Stamp color="greyscale4" size={30} />
      <Box marginLeft="m">
        <Text marginBottom="m" variant="address">
          {address.firstName} {address.lastName}
        </Text>
        <Text marginBottom="m" variant="address">
          {address.address1}
        </Text>
        {address.address2 ? (
          <Text marginBottom="m" style={{ minHeight: 17 }} variant="address">
            {address.address2}
          </Text>
        ) : null}
        <Text marginBottom="m" variant="address">
          {address.zipcode} {address.city}
          {" ("}
          {address.zone?.name}
          {") "}
        </Text>
        <Text variant="address">{address.country?.name}</Text>
      </Box>
    </Card>
  );
};

export default Address;
