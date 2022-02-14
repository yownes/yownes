import React from "react";
import { useGetTopSales } from "@yownes/api";

import { Box, Loading, Text } from "../atoms";
import { Slider, ProductCard } from "../molecules";

const TopSalesProducts = () => {
  const { loading, data } = useGetTopSales();
  if (loading) {
    return <Loading />;
  }
  if (!data) {
    return null;
  }
  return (
    <Box>
      <Text variant="header3" paddingBottom="m">
        Los productos más vendidos
      </Text>
      <Slider>
        {data.bestSells?.map(
          (product) =>
            product && <ProductCard key={product?.id} product={product} />
        ) ?? []}
      </Slider>
    </Box>
  );
};

export default TopSalesProducts;
