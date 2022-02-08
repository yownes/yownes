import React from "react";
import { PaymentMethodFragment } from "@yownes/api";

import { Card, Text } from "../atoms";

interface CreditCardProps {
  data: PaymentMethodFragment;
}

export const CREDIT_CARD_HEIGHT = 150;

const CreditCard = ({ data }: CreditCardProps) => {
  return (
    <Card
      variant="elevated"
      backgroundColor="primary"
      padding="l"
      height={CREDIT_CARD_HEIGHT}
    >
      <Text
        variant="header"
        marginTop="xl"
        marginBottom="m"
      >{`****  ****  ****  ${data.last4}`}</Text>
      <Text variant="header4">{data.name}</Text>
      <Text>{`EXP: ${data.expMonth}/${data.expYear}`}</Text>
    </Card>
  );
};

export default CreditCard;
