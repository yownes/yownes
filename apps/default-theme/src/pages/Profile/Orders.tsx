import React from "react";
import { FlatList, Pressable } from "react-native";
import { useGetOrders } from "@yownes/api";

import { Box } from "../../components/atoms";
import { Order } from "../../components/molecules";
import { OrdersProps } from "../../navigation/Profile";
import { useTheme } from "../../lib/theme";
import filterNulls from "../../lib/filterNulls";

const Orders = ({ navigation }: OrdersProps) => {
  const { data } = useGetOrders();
  const theme = useTheme();
  const orders = data?.orders?.filter(filterNulls);
  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => String(item?.id)}
      contentContainerStyle={{
        paddingTop: theme.spacing.m,
        paddingHorizontal: theme.spacing.m,
      }}
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
    />
  );
};

export default Orders;
