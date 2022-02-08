import React, { useEffect } from "react";
import { Dimensions, Image, StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useGetHome } from "@yownes/api";

import { Box, Button, Loading } from "../components/atoms";
import { HorizontalScrollProducts, HomeSlide } from "../components/molecules";
import { HomeProps } from "../navigation/Home";

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  banner: {
    width,
    height: 100,
  },
});

const Home = ({ navigation }: HomeProps) => {
  const { loading, data } = useGetHome();
  useEffect(() => {
    navigation.setOptions({
      title: data?.home?.meta?.title ?? "",
    });
  }, [navigation, data]);
  if (loading) {
    return <Loading />;
  }
  return (
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
  );
};

export default Home;
