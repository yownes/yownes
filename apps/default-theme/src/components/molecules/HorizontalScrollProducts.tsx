import React from "react";
import { ScrollView } from "react-native";
import { BasicProduct } from "@yownes/api";

import { useTheme } from "../../lib/theme";
import filterNulls from "../../lib/filterNulls";
import { Box, Text } from "../atoms";

import VerticalProductCard from "./VerticalProductCard";

interface HorizontalScrollProductsProps {
  products?: (BasicProduct | null)[] | null;
  title: string;
}

const HorizontalScrollProducts = ({
  products,
  title,
}: HorizontalScrollProductsProps) => {
  const theme = useTheme();
  const prods = products?.filter(filterNulls);
  return (
    <Box>
      <Text variant="header3" paddingBottom="m" paddingLeft="l">
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: theme.spacing.l }}
      >
        {prods?.map((product) => (
          <VerticalProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </Box>
  );
};

export default HorizontalScrollProducts;
