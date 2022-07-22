import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import type { Cart_cart } from "@yownes/api";
import { useRemoveDiscount } from "@yownes/api";

import { Box, Card, Text } from "../../../components/atoms";
import theme from "../../../lib/theme";

interface SummaryProps {
  cart?: Cart_cart;
}

const Summary = ({ cart }: SummaryProps) => {
  const [removeDiscount, { loading }] = useRemoveDiscount();
  if (!cart) {
    return null;
  }
  return (
    <Card padding="l">
      <Text variant="header3" paddingBottom="m">
        Resumen del pedido
      </Text>
      <Box flexDirection="row" justifyContent="space-between" paddingBottom="m">
        <Text variant="subtotal">Cantidad</Text>
        <Text variant="subtotal">{cart.products?.length}</Text>
      </Box>
      {cart.subtotals?.products && (
        <Box
          flexDirection="row"
          justifyContent="space-between"
          paddingBottom="m"
        >
          <Text variant="subtotal">{cart.subtotals.products.label}</Text>
          <Text variant="subtotal">{cart.subtotals?.products.value}</Text>
        </Box>
      )}
      {cart.subtotals?.discounts && (
        <Box
          flexDirection="row"
          justifyContent="space-between"
          paddingBottom="m"
        >
          <Text variant="subtotal">{cart.subtotals.discounts.label}</Text>
          <Text variant="subtotal">{cart.subtotals?.discounts.value}</Text>
        </Box>
      )}
      {cart.subtotals?.shipping && (
        <Box
          flexDirection="row"
          justifyContent="space-between"
          paddingBottom="m"
        >
          <Text variant="subtotal">{cart.subtotals?.shipping.label}</Text>
          <Text variant="subtotal">{cart.subtotals?.shipping.value}</Text>
        </Box>
      )}
      <Box flexDirection="row" justifyContent="space-between">
        <Text variant="bold">{cart.total?.label}</Text>
        <Text variant="bold">{cart.total?.value}</Text>
      </Box>
      {cart.vouchers?.allowed && Boolean(cart.vouchers?.added?.length) && (
        <Box
          marginTop="l"
          paddingTop="l"
          borderTopWidth={1}
          borderColor="greyscale5"
        >
          {cart.vouchers?.added?.map((voucher, i) => (
            <Box
              key={voucher?.id}
              justifyContent="space-between"
              flexDirection="row"
              marginBottom={
                i === (cart.vouchers?.added?.length ?? 0) - 1 ? "s" : "m"
              }
            >
              <Box flexDirection="row">
                <Text variant="subtotal">{voucher?.name}</Text>
                {voucher?.code ? (
                  <Text variant="subtotal"> - {voucher.code}</Text>
                ) : null}
              </Box>
              <Box alignItems="flex-end">
                <Text backgroundColor="danger" variant="subtotal">
                  {voucher?.reduction}
                </Text>
                {voucher?.code ? (
                  <TouchableOpacity
                    onPress={() => {
                      removeDiscount({ variables: { id: voucher.id } });
                    }}
                  >
                    <Box alignItems="flex-end" flexDirection="row">
                      {loading && (
                        <ActivityIndicator
                          color={theme.colors.primary}
                          style={{ marginRight: 10 }}
                        />
                      )}
                      <Text color="danger" fontSize={12} paddingVertical="s">
                        Eliminar
                      </Text>
                    </Box>
                  </TouchableOpacity>
                ) : null}
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
};

export default Summary;
