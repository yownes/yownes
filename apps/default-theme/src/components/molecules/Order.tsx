import React from "react";
import type { Orders_orders } from "@yownes/api";

import { Box, Card, Tag, Text } from "../atoms";

interface OrderProps {
  order: Orders_orders;
}

const Order = ({ order }: OrderProps) => {
  return (
    <Card padding="m">
      <Box justifyContent="space-between" flexDirection="row">
        <Text>Referencia: {order.reference}</Text>
        <Text>{order.state}</Text>
      </Box>
      <Box justifyContent="space-between" marginTop="l" flexDirection="row">
        <Text>{order.date}</Text>
        <Tag>{order.total}</Tag>
      </Box>
    </Card>
  );
};

export default Order;
