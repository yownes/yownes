import React from "react";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import type { BasicProduct } from "@yownes/api";

import { useTheme } from "../../lib/theme";
import { Box, Tag, Text } from "../atoms";
import { useNavigation } from "../../navigation/Root";

interface ProductCardProps {
  product: BasicProduct;
}

const { width } = Dimensions.get("window");
export const CARD_HEIGHT = 200;

const ProductCard = ({ product }: ProductCardProps) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const { image, name, price, manufacturer, special } = product;
  return (
    <TouchableOpacity
      onPress={() => {
        if (product.id) {
          navigation.navigate("ProductStack", {
            screen: "Product",
            params: { id: product.id },
          });
        }
      }}
    >
      <Box
        backgroundColor="white"
        padding="s"
        flexDirection="row"
        height={CARD_HEIGHT}
        flex={1}
      >
        <Box>
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: width / 2 - theme.spacing.l - theme.spacing.s,
                height: "100%",
              }}
            />
          )}
        </Box>
        <Box padding="m" width={width / 2 - theme.spacing.l - theme.spacing.s}>
          <Text variant="header3">{manufacturer}</Text>
          <Text marginVertical="m">{name}</Text>
          <Box flexDirection="row">
            <Tag>{price}</Tag>
            {special !== null && <Text>{special}</Text>}
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default ProductCard;
