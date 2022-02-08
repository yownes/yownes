import { useFocusEffect } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { Dimensions, Image, Pressable, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { SharedElement } from "react-navigation-shared-element";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import {
  useGetProduct,
  useAddToCart,
  useAddToFavourite,
  useRemoveFavourite,
} from "@yownes/api";
import { useAuth } from "@yownes/core";

import { Box, Button, Tag, Text, HtmlText } from "../../components/atoms";
import { Favourite, FavouriteOutlined } from "../../components/icons";
import { Quantity } from "../../components/molecules";
import { useTheme } from "../../lib/theme";
import { ProductProps } from "../../navigation/Product";

const { height, width } = Dimensions.get("screen");

const Product = ({ route, navigation }: ProductProps) => {
  const theme = useTheme();
  const { index, id } = route.params;

  const [opacity, setOpacity] = useState(1);
  const { isAuthenticated } = useAuth();
  const ref = useRef<BottomSheetModal>(null);
  const { data } = useGetProduct(id);
  const [addToCart] = useAddToCart();
  const [addToFavourite] = useAddToFavourite(id, data);
  const [removeFavourite] = useRemoveFavourite(id, data);
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<
    Record<string, string | null | undefined>
  >({});
  useFocusEffect(() => {
    if (navigation.isFocused()) {
      setOpacity(1);
    }
  });
  const IMAGES: string[] = [
    data?.product?.image,
    ...(data?.product?.images?.map((img) => img?.image) ?? []),
  ]
    .filter(
      (str: string | null | undefined) => str !== null && str !== undefined
    )
    .map((img) => img as string);
  return (
    <BottomSheetModalProvider>
      <ScrollView>
        <ScrollView
          contentOffset={{ x: width * (index ?? 0), y: 0 }}
          style={{ opacity }}
          horizontal
          snapToInterval={width}
          decelerationRate="fast"
        >
          {IMAGES.map((image, i) => (
            <Pressable
              key={i}
              onPress={() => {
                if (data?.product) {
                  navigation.navigate("Images", {
                    product: data.product,
                    index: i,
                  });
                  setOpacity(0);
                }
              }}
            >
              <SharedElement id={`image.${i}.${data?.product?.id}`}>
                <Image
                  source={{ uri: image }}
                  style={{
                    height: height / 2,
                    width,
                  }}
                />
              </SharedElement>
            </Pressable>
          ))}
        </ScrollView>
        <Box padding="l" backgroundColor="white" marginBottom="m">
          <Text paddingBottom="l" variant="header4">
            {data?.product?.manufacturer}
          </Text>
          <HtmlText>{data?.product?.shortDescription}</HtmlText>
          <Box flexDirection="row" paddingVertical="l">
            <Tag>{data?.product?.price}</Tag>
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Quantity
              qty={qty}
              onChange={setQty}
              limit={data?.product?.stock ?? 0}
            />
            <TouchableOpacity
              onPress={() => {
                if (isAuthenticated) {
                  if (data?.product?.inWishlist) {
                    removeFavourite();
                  } else {
                    addToFavourite();
                  }
                } else {
                  ref.current?.present();
                }
              }}
            >
              {data?.product?.inWishlist ? (
                <Favourite />
              ) : (
                <FavouriteOutlined />
              )}
            </TouchableOpacity>
          </Box>
        </Box>
        {(data?.product?.options?.length ?? 0) > 0 && (
          <Box paddingBottom="l" backgroundColor="white" marginBottom="m">
            {data?.product?.options?.map((option) => (
              <Box key={option?.name}>
                <Text
                  variant="header4"
                  paddingBottom="l"
                  paddingLeft="l"
                  marginTop="m"
                >
                  {option?.name}
                </Text>
                <ScrollView
                  horizontal
                  style={{ paddingHorizontal: theme.spacing.l }}
                >
                  {option?.values?.map((value) => (
                    <TouchableOpacity
                      key={value?.id}
                      onPress={() => {
                        const { name } = option;
                        if (name) {
                          setOptions((attrs) => ({
                            ...attrs,
                            [name]: value?.id,
                          }));
                        }
                      }}
                    >
                      <Box
                        marginRight="l"
                        backgroundColor={
                          option?.name && options[option.name] === value?.id
                            ? "greyscale5"
                            : "greyscale2"
                        }
                        borderRadius={15}
                        padding="m"
                      >
                        <Text>{value?.name}</Text>
                      </Box>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Box>
            ))}
          </Box>
        )}
        <Box
          padding="l"
          paddingTop="m"
          backgroundColor="white"
          marginBottom="m"
        >
          <Text variant="header4" paddingBottom="l">
            Descripción
          </Text>
          <HtmlText color="greyscale4">{data?.product?.description}</HtmlText>
        </Box>
        <Box padding="l" paddingTop="m" flexDirection="row">
          <Button
            label="Tallas"
            onPress={() => {
              // TODO: Sizes screen sizes
              return;
            }}
            flex={1}
            marginRight="l"
          />
          <Button
            label="Añadir a la cesta"
            onPress={() => {
              const opts = Object.entries(options).map(([optionId, value]) => ({
                id: optionId,
                value: value as string,
              }));

              addToCart({
                variables: {
                  id: route.params.id,
                  quantity: qty,
                  options: opts,
                },
              });
            }}
            flex={1}
          />
        </Box>
      </ScrollView>
      <BottomSheetModal
        index={0}
        ref={ref}
        snapPoints={[200]}
        backdropComponent={BottomSheetBackdrop}
      >
        <Box padding="l">
          <Text variant="header" textAlign="center" marginBottom="xl">
            Debes iniciar sesión para poder añadir productos a favoritos
          </Text>
          <Box flexDirection="row" justifyContent="space-around">
            <Button
              label="Iniciar sesión"
              onPress={() => {
                navigation.navigate("Perfil", { screen: "Login" });
              }}
            />
          </Box>
        </Box>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export default Product;
