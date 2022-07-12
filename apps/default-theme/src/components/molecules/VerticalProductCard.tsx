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
export const CARD_HEIGHT = 250;

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
        flexDirection="column"
        height={CARD_HEIGHT}
        width={width / 2 - theme.spacing.m * 2.5}
        marginRight="m"
      >
        <Box>
          {image && (
            <Image
              source={{ uri: image }}
              style={{
                width: "100%",
                height: CARD_HEIGHT / 2,
              }}
            />
          )}
        </Box>
        <Box padding="m">
          <Text variant="header3">{manufacturer}</Text>
          <Text marginVertical="m" style={{ flexShrink: 1 }}>
            {name}
          </Text>
          <Box flexDirection="row">
            {special ? (
              <>
                <Tag>{special}</Tag>
                <Box justifyContent="flex-end">
                  <Text lineHeight={24} paddingHorizontal="m" variant="through">
                    {price}
                  </Text>
                </Box>
                <Box justifyContent="flex-end">
                  <Text color="danger" lineHeight={24} variant="small">
                    -
                    {price &&
                      Math.round(
                        100 -
                          (parseFloat(special.slice(0, -2).replace(",", ".")) /
                            parseFloat(
                              price.slice(0, -2).replace(",", ".") ?? "0"
                            )) *
                            100
                      )}
                    %
                  </Text>
                </Box>
              </>
            ) : (
              <Tag>{price}</Tag>
            )}
          </Box>
        </Box>
      </Box>
    </TouchableOpacity>
  );
};

export default ProductCard;
