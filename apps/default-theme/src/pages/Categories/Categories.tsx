import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { useGetCategories, useGetLazyProducts } from "@yownes/api";

import { Box, Loading } from "../../components/atoms";
import { SearchHeader, Category } from "../../components/molecules";
import { TopSalesProducts } from "../../components/organisms";

import SearchSuggestions from "./Components/SearchSuggestions";

const Categories = () => {
  const { loading, data } = useGetCategories();
  const [queryProducts, productsResult] = useGetLazyProducts();
  const [search, setSearch] = useState("");
  useEffect(() => {
    if (search) {
      queryProducts({ variables: { search } });
    }
  }, [search, queryProducts]);
  if (loading) {
    return (
      <>
        <SearchHeader value={search} onChange={() => {}} />
        <Loading />
      </>
    );
  }
  return (
    <>
      <SearchHeader value={search} onChange={setSearch} />
      <Box>
        <ScrollView>
          <Box>
            {data?.categoriesList?.content?.map(
              (category) =>
                category && <Category key={category?.id} category={category} />
            )}
          </Box>
          <Box padding="l" marginTop="xl">
            <TopSalesProducts />
          </Box>
        </ScrollView>
        <Box position="absolute" style={{ width: "100%" }}>
          {productsResult.data?.productsList?.content && search !== "" && (
            <SearchSuggestions
              products={productsResult.data?.productsList.content}
            />
          )}
        </Box>
      </Box>
    </>
  );
};

export default Categories;
