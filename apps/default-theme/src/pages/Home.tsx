import React, { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useGetHome, useGetLazyProducts } from "@yownes/api";

import { Box, Button, Loading } from "../components/atoms";
import {
  HorizontalScrollProducts,
  HomeSlide,
  SearchHeader,
} from "../components/molecules";
import type { HomeProps } from "../navigation/Home";
import SearchSuggestions from "./Categories/Components/SearchSuggestions";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  banner: {
    width,
    height: 100,
  },
});

const Home = ({ navigation }: HomeProps) => {
  const { loading, data } = useGetHome();
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
          {data?.home?.banner && (
            <Image source={{ uri: data.home.banner }} style={styles.banner} />
          )}
          <ScrollView horizontal snapToInterval={width} decelerationRate="fast">
            {data?.home?.slides?.slides?.map((slide) => (
              <HomeSlide key={slide?.id} slide={slide} />
            ))}
          </ScrollView>
          {(data?.specialProducts?.content?.length ?? 0) > 0 && (
            <Box paddingVertical="l">
              <HorizontalScrollProducts
                products={data?.specialProducts?.content}
                title="En Oferta"
              />
            </Box>
          )}
          {(data?.latestProducts?.content?.length ?? 0) > 0 && (
            <Box paddingVertical="l">
              <HorizontalScrollProducts
                products={data?.latestProducts?.content}
                title="Últimos productos"
              />
            </Box>
          )}
          {(data?.bestSells?.length ?? 0) > 0 && (
            <Box paddingVertical="l">
              <HorizontalScrollProducts
                products={data?.bestSells}
                title="Los más vendidos"
              />
            </Box>
          )}
          <Box padding="l">
            <Button
              onPress={() => navigation.navigate("About")}
              label="Sobre nosotros"
            />
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

export default Home;
