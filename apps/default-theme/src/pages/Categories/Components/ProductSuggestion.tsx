import React from "react";
import { Image, StyleSheet, TouchableOpacity } from "react-native";
import type { BasicProduct } from "@yownes/api";

import { useNavigation } from "../../../navigation/Root";
import { Box, Card, Text } from "../../../components/atoms";

interface ProductSuggestionProps {
  product: BasicProduct;
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
});

const ProductSuggestion = ({ product }: ProductSuggestionProps) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => {
        if (product.id) {
          navigation.navigate("ProductStack", {
            screen: "Product",
            params: {
              id: product.id,
            },
          });
        }
      }}
    >
      <Card flexDirection="row">
        {product.image && (
          <Image source={{ uri: product.image }} style={styles.image} />
        )}
        <Box padding="m">
          <Text>{product.name}</Text>
        </Box>
      </Card>
    </TouchableOpacity>
  );
};

export default ProductSuggestion;
