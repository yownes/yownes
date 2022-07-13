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
        <Text variant="body">Referencia: {order.reference}</Text>
        <Text variant="header3">
          {!order.state || order.state === "" ? "Desconocido" : order.state}
        </Text>
      </Box>
      <Box
        alignItems="center"
        justifyContent="space-between"
        marginTop="l"
        flexDirection="row"
      >
        <Text color="greyscale4" variant="body">
          {order.date}
        </Text>
        <Box alignItems="center" flexDirection="row">
          <Text color="greyscale4" paddingHorizontal="l" variant="body">
            Productos: {order?.quantity}
          </Text>
          <Tag fixedWidth>{order.total}</Tag>
        </Box>
      </Box>
    </Card>
  );
};

export default Order;
