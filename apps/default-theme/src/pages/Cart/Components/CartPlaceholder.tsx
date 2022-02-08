import React from "react";
import { RefreshControl } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { Box, Text } from "../../../components/atoms";
import { EmptyCart } from "../../../components/images";
import { InterestProducts } from "../../../components/organisms";

interface CartPlaceholderProps {
  loading: boolean;
  onRefresh: () => void;
}

const CartPlaceholder = ({ loading, onRefresh }: CartPlaceholderProps) => {
  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} />
      }
    >
      <Box padding="l">
        <EmptyCart />
        <Text variant="header2" textAlign="center" marginVertical="xl">
          Tu carrito está vacío
        </Text>
        <InterestProducts />
      </Box>
    </ScrollView>
  );
};

export default CartPlaceholder;
