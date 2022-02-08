import React from "react";
import { FlatList } from "react-native";
import { useGetFavourites } from "@yownes/api";

import { Box, Text } from "../../components/atoms";
import { ProductCard } from "../../components/molecules";
import NoFavsImage from "../../components/images/NoFavs";
import filterNulls from "../../lib/filterNulls";

const FavouritesPlaceholder = () => (
  <Box padding="l">
    <NoFavsImage />
    <Text variant="header2" textAlign="center" marginVertical="l">
      No tienes productos favoritos
    </Text>
  </Box>
);

const Favourites = () => {
  const { data } = useGetFavourites();
  const favourites = data?.wishlist?.filter(filterNulls);
  return (
    <Box flex={1} paddingHorizontal="l" paddingTop="m">
      <FlatList
        data={favourites}
        keyExtractor={(item) => String(item?.id)}
        ListEmptyComponent={<FavouritesPlaceholder />}
        renderItem={({ item }) => (
          <Box marginBottom="m" key={item?.id}>
            <ProductCard product={item} />
          </Box>
        )}
      />
    </Box>
  );
};

export default Favourites;
