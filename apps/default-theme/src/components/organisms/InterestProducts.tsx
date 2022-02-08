import React from "react";
import { useGetTopSales } from "@yownes/api";

import { Loading } from "../atoms";
import { HorizontalScrollProducts } from "../molecules";

const InterestProducts = () => {
  const { loading, data } = useGetTopSales();
  if (loading) return <Loading />;
  if (!data) return null;
  return (
    <HorizontalScrollProducts
      products={data.bestSells}
      title="Tal vez te interese"
    />
  );
};

export default InterestProducts;
