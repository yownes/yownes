import React from "react";
import { AddressFragment } from "@yownes/api";

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
        <Text color="greyscale4" marginBottom="l">
          {address.firstName} {address.lastName}
        </Text>
        <Text color="greyscale4" marginBottom="m">
          {address.address1}
        </Text>
        <Text color="greyscale4" marginBottom="m" style={{ minHeight: 17 }}>
          {address.address2}
        </Text>
        <Text color="greyscale4">{address.city}</Text>
      </Box>
    </Card>
  );
};

export default Address;
