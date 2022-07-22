import React from "react";
import { FlatList, Pressable, RefreshControl } from "react-native";
import { useGetOrders } from "@yownes/api";

import { Box, Loading, Text } from "../../components/atoms";
import { Order } from "../../components/molecules";
import NoOrdersImage from "../../components/images/NoOrders";
import type { OrdersProps } from "../../navigation/Profile";
import { useTheme } from "../../lib/theme";
import filterNulls from "../../lib/filterNulls";

const OrdersPlaceholder = () => (
  <Box padding="l">
    <NoOrdersImage />
    <Text variant="header2" textAlign="center" marginVertical="l">
      No has realizado ningún pedido
    </Text>
  </Box>
);

const Orders = ({ navigation }: OrdersProps) => {
  const { data, loading, refetch } = useGetOrders();
  const theme = useTheme();
  const orders = data?.orders?.filter(filterNulls);

  if (loading && !data) {
    return <Loading />;
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => String(item?.id)}
      contentContainerStyle={{
        paddingTop: theme.spacing.m,
        paddingHorizontal: theme.spacing.m,
      }}
      ListEmptyComponent={<OrdersPlaceholder />}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => {
            if (item.id) {
              navigation.navigate("Order", { id: item?.id });
            }
          }}
        >
          <Box paddingBottom="m">
            <Order order={item} />
          </Box>
        </Pressable>
      )}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refetch} />
      }
    />
  );
};

export default Orders;
