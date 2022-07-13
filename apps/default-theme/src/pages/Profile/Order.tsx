import React from "react";
import { Image, ScrollView } from "react-native";
import { useGetOrder } from "@yownes/api";

import { Box, Card, Text } from "../../components/atoms";
import type { OrderProps } from "../../navigation/Profile";

const Order = ({ route }: OrderProps) => {
  const { data } = useGetOrder(route.params.id);

  return (
    <ScrollView>
      <Box padding="m">
        <Card padding="m" marginBottom="m">
          <Text>Referencia: {data?.order?.reference}</Text>
          <Text>Pedido: {data?.order?.id}</Text>
        </Card>
        <Card padding="m" marginBottom="m">
          <Text>Fecha: {data?.order?.date}</Text>
          <Text marginVertical="s">
            Estado:{" "}
            {!data?.order?.state || data?.order?.state === ""
              ? "Desconocido"
              : data?.order?.state}
          </Text>
          <Text>Transportista: {data?.order?.shippingMethod?.name}</Text>
        </Card>
        <Card padding="m" marginBottom="m">
          <Box marginLeft="m">
            <Text variant="header2">Dirección de envío</Text>
            <Text>
              {data?.order?.shippingAddress?.firstName}{" "}
              {data?.order?.shippingAddress?.lastName}
            </Text>
            <Text marginVertical="s">
              {data?.order?.shippingAddress?.address1}
            </Text>
            <Text>{data?.order?.shippingAddress?.address2}</Text>
            <Text>{data?.order?.shippingAddress?.city}</Text>
          </Box>
        </Card>
        <Card padding="m" marginBottom="m">
          <Box marginLeft="m">
            <Text variant="header2">Dirección de facturación</Text>
            <Text>
              {data?.order?.paymentAddress?.firstName}{" "}
              {data?.order?.paymentAddress?.lastName}
            </Text>
            <Text marginVertical="s">
              {data?.order?.paymentAddress?.address1}
            </Text>
            <Text>{data?.order?.paymentAddress?.address2}</Text>
            <Text>{data?.order?.paymentAddress?.city}</Text>
          </Box>
        </Card>
        {data?.order?.products?.map((product) => (
          <Card key={product?.key} padding="m" marginBottom="s">
            <Box flexDirection="row">
              {product?.product?.image && (
                <Image
                  source={{ uri: product.product.image }}
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: 5,
                  }}
                />
              )}
              <Box paddingStart="m" flex={1}>
                <Box paddingBottom="m">
                  <Text variant="header2">{product?.product?.name}</Text>
                </Box>
                <Box flexDirection="row" paddingTop="m">
                  <Box flex={1}>
                    <Text>{product?.product?.price}</Text>
                  </Box>
                  <Box flex={1} alignItems="center">
                    <Text>{product?.quantity}</Text>
                  </Box>
                  <Box flex={1} alignItems="flex-end">
                    <Text>{product?.total}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
        <Card padding="m">
          {data?.order?.subtotals?.map((line) => {
            if (line?.value) {
              return (
                <Box key={line.label} flexDirection="row" paddingVertical="s">
                  <Box flex={4} alignItems="flex-end" paddingRight="m">
                    <Text>{line.label}</Text>
                  </Box>
                  <Box flex={1} alignItems="flex-end">
                    <Text>{line.value}</Text>
                  </Box>
                </Box>
              );
            } else {
              return null;
            }
          })}
          <Box flexDirection="row" paddingVertical="m">
            <Box flex={4} alignItems="flex-end" paddingRight="m">
              <Text variant="header2">Total</Text>
            </Box>
            <Box flex={1} alignItems="flex-end">
              <Text variant="header2">{data?.order?.total}</Text>
            </Box>
          </Box>
        </Card>
      </Box>
    </ScrollView>
  );
};

export default Order;
