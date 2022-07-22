import React from "react";
import { Image, ScrollView } from "react-native";
import { useGetOrder } from "@yownes/api";

import { Box, Card, Loading, Tag, Text } from "../../components/atoms";
import type { OrderProps } from "../../navigation/Profile";

const Order = ({ route }: OrderProps) => {
  const { data, loading } = useGetOrder(route.params.id);

  if (loading && !data) {
    return <Loading />;
  }

  return (
    <ScrollView>
      <Box padding="m">
        <Card padding="l" marginBottom="m">
          <Box marginBottom="m">
            <Text variant="header3">Información del pedido</Text>
          </Box>
          <Box
            marginBottom="m"
            justifyContent="space-between"
            flexDirection="row"
          >
            <Box>
              <Text variant="subtotal">Estado</Text>
            </Box>
            <Box maxWidth={200}>
              <Text textAlign="right" variant="subtotal">
                {!data?.order?.state || data?.order?.state === ""
                  ? "Desconocido"
                  : data?.order?.state}
              </Text>
            </Box>
          </Box>
          <Box
            marginBottom="m"
            justifyContent="space-between"
            flexDirection="row"
          >
            <Text variant="subtotal">Fecha</Text>
            <Text variant="subtotal">{data?.order?.date}</Text>
          </Box>
          <Box
            marginBottom="m"
            justifyContent="space-between"
            flexDirection="row"
          >
            <Text variant="subtotal">Referencia</Text>
            <Text variant="subtotal">{data?.order?.reference}</Text>
          </Box>
          <Box
            marginBottom="m"
            justifyContent="space-between"
            flexDirection="row"
          >
            <Text variant="subtotal">Pedido</Text>
            <Text variant="subtotal">{data?.order?.id}</Text>
          </Box>
          <Box justifyContent="space-between" flexDirection="row">
            <Text variant="bold">Total</Text>
            <Text variant="bold">
              {data?.order?.total} ({data?.order?.quantity} productos)
            </Text>
          </Box>
        </Card>
        {data?.order?.products?.map((product, i) => (
          <Card
            key={product?.key}
            padding="m"
            marginBottom={data?.order?.products?.length === i + 1 ? "m" : "s"}
          >
            <Box flexDirection="row">
              {product?.product?.image && (
                <Image
                  source={{ uri: product.product.image }}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 5,
                  }}
                />
              )}
              <Box justifyContent="space-between" paddingStart="m" flex={1}>
                <Box justifyContent="space-between" flexDirection="row">
                  <Box flex={1}>
                    <Text /*style={{ flexShrink: 1 }}*/>
                      {product?.product?.name}
                    </Text>
                  </Box>
                  <Box>
                    <Tag>{product?.total}</Tag>
                  </Box>
                </Box>
                <Box
                  flexDirection="row"
                  justifyContent="space-between"
                  paddingTop="m"
                  flex={1}
                >
                  <Box justifyContent="flex-end">
                    {
                      // #TODO: atributos del producto: product?.option?.map
                    }
                  </Box>
                  <Box flexDirection="row" alignItems="flex-end">
                    <Text marginRight="m" variant="header3">
                      {product?.product?.price}
                    </Text>
                    <Text variant="header3">x {product?.quantity}</Text>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
        <Card padding="l" marginBottom="m">
          <Text marginBottom="m" variant="header3">
            Dirección de envío
          </Text>
          <Text marginBottom="s" variant="subtotal">
            {data?.order?.shippingAddress?.firstName}{" "}
            {data?.order?.shippingAddress?.lastName}
          </Text>
          <Text marginBottom="s" variant="subtotal">
            {data?.order?.shippingAddress?.address1}
          </Text>
          {data?.order?.shippingAddress?.address2 ? (
            <Text marginBottom="s" variant="subtotal">
              {data?.order?.shippingAddress?.address2}
            </Text>
          ) : null}
          <Text marginBottom="s" variant="subtotal">
            {data?.order?.shippingAddress?.zipcode}{" "}
            {data?.order?.shippingAddress?.city}
            {" ("}
            {data?.order?.shippingAddress?.zone?.name}
            {") "}
          </Text>
          <Text marginBottom="l" variant="subtotal">
            {data?.order?.shippingAddress?.country?.name}
          </Text>
          <Text marginBottom="m" variant="header3">
            Transportista
          </Text>
          <Text variant="subtotal">{data?.order?.shippingMethod?.name}</Text>
        </Card>
        <Card padding="l" marginBottom="m">
          <Text marginBottom="m" variant="header3">
            Método de pago
          </Text>
          {/* TODO: VISA terminada en 1234 */}
          <Text marginBottom="l" variant="subtotal">
            x terminada en xxxx
          </Text>
          <Text marginBottom="m" variant="header3">
            Dirección de facturación
          </Text>
          <Text marginBottom="s" variant="subtotal">
            {data?.order?.paymentAddress?.firstName}{" "}
            {data?.order?.paymentAddress?.lastName}
          </Text>
          <Text marginBottom="s" variant="subtotal">
            {data?.order?.paymentAddress?.address1}
          </Text>
          {data?.order?.paymentAddress?.address2 ? (
            <Text marginBottom="s" variant="subtotal">
              {data?.order?.paymentAddress?.address2}
            </Text>
          ) : null}
          <Text marginBottom="s" variant="subtotal">
            {data?.order?.paymentAddress?.zipcode}{" "}
            {data?.order?.paymentAddress?.city}
            {" ("}
            {data?.order?.paymentAddress?.zone?.name}
            {") "}
          </Text>
          <Text variant="subtotal">
            {data?.order?.paymentAddress?.country?.name}
          </Text>
        </Card>
        <Card padding="l">
          <Text marginBottom="m" variant="header3">
            Resumen del pedido
          </Text>
          {data?.order?.subtotals?.map((line) => {
            if (line?.value) {
              return (
                <Box
                  key={line.label}
                  flexDirection="row"
                  justifyContent="space-between"
                  marginBottom="m"
                >
                  <Text variant="subtotal">{line.label}</Text>
                  <Text variant="subtotal">{line.value}</Text>
                </Box>
              );
            } else {
              return null;
            }
          })}
          <Box justifyContent="space-between" flexDirection="row">
            <Text variant="bold">Total</Text>
            <Text variant="bold">{data?.order?.total}</Text>
          </Box>
        </Card>
      </Box>
    </ScrollView>
  );
};

export default Order;
