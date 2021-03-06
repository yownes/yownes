import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Dimensions, Image, Pressable, ScrollView } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-root-toast";
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

import {
  Box,
  Button,
  Tag,
  Text,
  HtmlText,
  Loading,
} from "../../components/atoms";
import { Favourite, FavouriteOutlined } from "../../components/icons";
import { Quantity } from "../../components/molecules";
import {
  getPriceCombination,
  getStockCombination,
  isInCombinations,
} from "../../lib/product";
import { useTheme } from "../../lib/theme";
import type { ProductProps } from "../../navigation/Product";

const { height, width } = Dimensions.get("screen");

const Product = ({ route, navigation }: ProductProps) => {
  const theme = useTheme();
  const { index, id } = route.params;

  const [opacity, setOpacity] = useState(1);
  const [stockCombination, setStockCombination] = useState(0);
  const { isAuthenticated } = useAuth();
  const ref = useRef<BottomSheetModal>(null);
  const {
    data,
    loading: productLoading,
    error: productError,
  } = useGetProduct(id);
  const [addToCart, { loading, error }] = useAddToCart();
  const [addToFavourite] = useAddToFavourite(id, data);
  const [removeFavourite] = useRemoveFavourite(id, data);
  const [qty, setQty] = useState(1);
  const [options, setOptions] = useState<
    Record<string, string | null | undefined>
  >({});
  useEffect(() => {
    if (data) {
      navigation.setOptions({
        title: data?.product?.name ?? "",
      });
    }
  }, [data, navigation]);
  useEffect(() => {
    if (data?.product?.options?.attributes) {
      data.product.options.attributes.map((option) => {
        option?.values?.map((value) => {
          const { name } = option;
          if (name && value.selected) {
            setOptions((attrs) => ({
              ...attrs,
              [name]: value?.id,
            }));
          }
        });
      });
    }
  }, [data?.product?.options?.attributes]);
  useEffect(() => {
    if (data?.product?.options?.combinations) {
      setStockCombination(
        getStockCombination(
          options,
          data.product.options.combinations,
          data.product.stock
        )
      );
      setQty(1);
    }
  }, [options, data?.product?.options?.combinations]);
  useFocusEffect(() => {
    if (navigation.isFocused()) {
      setOpacity(1);
    }
  });
  const IMAGES: string[] = [
    data?.product?.image,
    ...(data?.product?.images?.map((img) => img?.imageBig) ?? []),
  ]
    .filter(
      (str: string | null | undefined) => str !== null && str !== undefined
    )
    .map((img) => img as string);

  if (productLoading) {
    return <Loading />;
  }

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
            {data?.product?.special ? (
              <>
                <Tag>{data.product.special}</Tag>
                <Box justifyContent="flex-end">
                  <Text
                    lineHeight={24}
                    paddingHorizontal="m"
                    variant="throughSmall"
                  >
                    {data?.product?.price}
                  </Text>
                </Box>
                <Box justifyContent="flex-end">
                  <Text color="danger" lineHeight={24} variant="small">
                    -
                    {data.product.price &&
                      Math.round(
                        100 -
                          (parseFloat(
                            data.product.special.slice(0, -2).replace(",", ".")
                          ) /
                            parseFloat(
                              data?.product?.price
                                .slice(0, -2)
                                .replace(",", ".") ?? "0"
                            )) *
                            100
                      )}
                    %
                  </Text>
                </Box>
              </>
            ) : (
              <Tag>
                {getPriceCombination(
                  data?.product?.price,
                  data?.product?.tax,
                  options,
                  data?.product?.options?.combinations
                )}
              </Tag>
            )}
          </Box>
          <Box flexDirection="row" justifyContent="space-between">
            <Quantity
              qty={qty}
              onChange={setQty}
              limit={stockCombination ?? -1}
            />
            <TouchableOpacity
              onPress={() => {
                if (isAuthenticated) {
                  if (data?.product?.inWishlist) {
                    removeFavourite({
                      optimisticResponse: {
                        removeWishlist: [
                          {
                            __typename: "Product",
                            id: id,
                            inWishlist: data?.product?.inWishlist,
                          },
                        ],
                      },
                    });
                    Toast.show("??Eliminado de Favoritos!", {
                      backgroundColor: "#fff",
                      duration: Toast.durations.SHORT,
                      opacity: 1,
                      position: -80,
                      textColor: "#000",
                    });
                  } else {
                    addToFavourite({
                      optimisticResponse: {
                        addToWishlist: [
                          {
                            __typename: "Product",
                            id: id,
                            inWishlist: !data?.product?.inWishlist,
                          },
                        ],
                      },
                    });
                    Toast.show("??A??adido a Favoritos!", {
                      backgroundColor: "#fff",
                      duration: Toast.durations.SHORT,
                      opacity: 1,
                      position: -80,
                      textColor: "#000",
                    });
                  }
                } else {
                  ref.current?.present();
                }
              }}
            >
              {data?.product?.inWishlist ? (
                <Favourite color="yellow" />
              ) : (
                <FavouriteOutlined color="greyscale3" />
              )}
            </TouchableOpacity>
          </Box>
        </Box>
        {(data?.product?.options?.attributes?.length ?? 0) > 0 && (
          <Box paddingBottom="l" backgroundColor="white" marginBottom="m">
            {data?.product?.options?.attributes?.map((option) => (
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
                          isInCombinations(
                            option.name,
                            value?.id,
                            options,
                            data?.product?.options?.combinations
                          )
                            ? (value.selected &&
                                option?.name &&
                                options[option.name] === undefined) ||
                              (option?.name &&
                                options[option.name] === value?.id)
                              ? "primary"
                              : "greyscale5"
                            : (value.selected &&
                                option?.name &&
                                options[option.name] === undefined) ||
                              (option?.name &&
                                options[option.name] === value?.id)
                            ? "primary"
                            : "greyscale2"
                        }
                        borderRadius={15}
                        opacity={
                          !isInCombinations(
                            option.name,
                            value?.id,
                            options,
                            data?.product?.options?.combinations
                          )
                            ? 0.8
                            : 1
                        }
                        padding="m"
                      >
                        <Text
                          variant={
                            isInCombinations(
                              option.name,
                              value?.id,
                              options,
                              data?.product?.options?.combinations
                            )
                              ? "body"
                              : "throughBody"
                          }
                        >
                          {value?.name}
                        </Text>
                      </Box>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Box>
            ))}
          </Box>
        )}
        {data?.product?.description ? (
          <Box
            padding="l"
            paddingTop="m"
            backgroundColor="white"
            marginBottom="m"
          >
            <Text variant="header4" paddingBottom="l">
              Descripci??n
            </Text>
            <HtmlText color="greyscale4">{data?.product?.description}</HtmlText>
          </Box>
        ) : null}
      </ScrollView>
      <Box
        backgroundColor="white"
        shadowColor="black"
        shadowOpacity={0.2}
        shadowOffset={{ width: 0, height: 5 }}
        shadowRadius={15}
        elevation={5}
      >
        <Button
          label="A??adir al carrito"
          disabled={loading || stockCombination < 1}
          isLoading={loading}
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
            }).then(() => {
              if (error) {
                Alert.alert("Error", error.message, [
                  { text: "Cerrar", style: "cancel" },
                ]);
              } else {
                Toast.show("??A??adido al carrito!", {
                  backgroundColor: "#fff",
                  duration: Toast.durations.SHORT,
                  opacity: 1,
                  position: -80,
                  textColor: "#000",
                });
              }
            });
          }}
          marginHorizontal="l"
          marginVertical="m"
        />
      </Box>
      <BottomSheetModal
        index={0}
        ref={ref}
        snapPoints={[200]}
        backdropComponent={BottomSheetBackdrop}
        style={{
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
        }}
      >
        <Box padding="l">
          <Text variant="header" textAlign="center" marginBottom="xl">
            Debes iniciar sesi??n para poder a??adir productos a favoritos
          </Text>
          <Box flexDirection="row" justifyContent="space-around">
            <Button
              label="Iniciar sesi??n"
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
