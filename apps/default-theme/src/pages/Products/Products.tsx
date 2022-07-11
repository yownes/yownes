import React, { useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import type { Products_productsList_content } from "@yownes/api";
import { useGetProducts, NetworkStatus } from "@yownes/api";

import { Box, Loading } from "../../components/atoms";
import type { ProductsProps } from "../../navigation/Root";
import { ProductCard, VerticalProductCard } from "../../components/molecules";
import { useTheme } from "../../lib/theme";

import Filters, { BAR_HEIGHT } from "./Components/Filters";
import Facet from "./Components/Facet";
import Order from "./Components/Order";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const styles = StyleSheet.create({
  modal: {
    // for Android top shadow
    backgroundColor: "white",
    borderRadius: 24,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 10,
  },
});

const Products = ({ route }: ProductsProps) => {
  const category = route.params?.category;
  const theme = useTheme();
  const transY = useSharedValue(0);
  const [isList, setIsList] = useState(true);
  const [filter, setFilter] = useState("");
  const [orderState, setOrder] = useState<{ sort?: string; order?: string }>({
    sort: undefined,
    order: undefined,
  });
  const snapPoints = useMemo(() => ["30%", "70%"], []);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const bottomSheetSortRef = useRef<BottomSheetModal>(null);
  const variables = {
    category: category?.id,
    filter,
    sort: orderState.sort,
    order: orderState.order,
  };
  const { loading, data, networkStatus } = useGetProducts(variables);
  const onScroll = useAnimatedScrollHandler<{ y: number }>({
    onBeginDrag({ contentOffset }, ctx) {
      ctx.y = contentOffset.y;
    },
    onScroll({ contentOffset }, { y }) {
      transY.value = contentOffset.y - y;
    },
  });
  const filterStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      transY.value,
      [0, BAR_HEIGHT],
      [0, -BAR_HEIGHT],
      Extrapolate.CLAMP
    );
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1,
      transform: [{ translateY }],
    };
  });
  if (loading && networkStatus !== NetworkStatus.setVariables) {
    return <Loading />;
  }
  return (
    <BottomSheetModalProvider>
      <Animated.View style={filterStyle}>
        <Filters
          list={isList}
          onListChange={setIsList}
          onFiltersPress={() => {
            bottomSheetRef.current?.present();
          }}
          onSortPress={() => {
            bottomSheetSortRef.current?.present();
          }}
        />
      </Animated.View>
      <AnimatedFlatList
        contentContainerStyle={{
          paddingTop: BAR_HEIGHT + theme.spacing.m,
          paddingHorizontal: theme.spacing.l,
        }}
        numColumns={isList ? 1 : 2}
        data={data?.productsList?.content}
        onScroll={onScroll}
        key={isList ? "list" : "grid"}
        scrollEventThrottle={32}
        renderItem={({ item }: { item: Products_productsList_content }) => (
          <Box paddingBottom="m">
            {isList ? (
              <ProductCard product={item} />
            ) : (
              <VerticalProductCard product={item} />
            )}
          </Box>
        )}
      />
      <BottomSheetModal
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={BottomSheetBackdrop}
        style={styles.modal}
      >
        <Box padding="m">
          {data?.productsList?.facets?.map((facet) => (
            <Facet
              onSelect={(value) => setFilter(value)}
              key={facet?.label}
              facet={facet}
            />
          ))}
        </Box>
      </BottomSheetModal>
      <BottomSheetModal
        ref={bottomSheetSortRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={BottomSheetBackdrop}
        style={styles.modal}
      >
        <Box padding="m">
          <Order
            sortOrders={data?.productsList?.sortOrders}
            onOrderSelected={(sort, order) => {
              setOrder({
                order,
                sort,
              });
            }}
          />
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default Products;
