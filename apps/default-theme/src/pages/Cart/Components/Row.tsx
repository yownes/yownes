import React, { useCallback } from "react";
import { Dimensions, Image, StyleSheet, TouchableOpacity } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import { useRemoveCart, useUpdateCart, Cart_cart_products } from "@yownes/api";
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { clamp, snapPoint } from "react-native-redash";

import { Box, Card, Tag, Text } from "../../../components/atoms";
import { Quantity } from "../../../components/molecules";
import { Trash } from "../../../components/icons";

interface RowProps {
  product: Cart_cart_products;
}

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
  },
});

const THRESHOLD = 100;
const { width } = Dimensions.get("window");
const points = [0, -THRESHOLD, -width];

const Row = ({ product }: RowProps) => {
  const translateX = useSharedValue(0);
  const deleting = useSharedValue(false);
  const [removeCart] = useRemoveCart();
  const [updateCart] = useUpdateCart();

  const deleteProduct = useCallback(() => {
    removeCart({ variables: { key: product.key } });
  }, [product, removeCart]);

  const gestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart(_, ctx) {
      ctx.x = translateX.value;
      deleting.value = false;
    },
    onActive({ translationX, velocityX }, ctx) {
      translateX.value = clamp(translationX + ctx.x, -width, 0);
      const pt = snapPoint(translateX.value, velocityX, points);
      if (pt === -width) {
        deleting.value = true;
      } else {
        deleting.value = false;
      }
    },
    onEnd({ velocityX }) {
      const pt = snapPoint(translateX.value, velocityX, points);
      translateX.value = withSpring(pt);

      if (pt === -width) {
        runOnJS(deleteProduct)();
      }
    },
  });
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    position: "relative",
  }));
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: withSpring(deleting.value ? 1.3 : 1) }],
    };
  });
  return (
    <Box>
      <TouchableOpacity style={StyleSheet.absoluteFill} onPress={deleteProduct}>
        <Box
          backgroundColor="greyscale5"
          padding="l"
          alignItems="flex-end"
          justifyContent="center"
          flex={1}
        >
          <Animated.View style={iconStyle}>
            <Trash />
          </Animated.View>
        </Box>
      </TouchableOpacity>
      <PanGestureHandler
        onGestureEvent={gestureEvent}
        activeOffsetX={[-20, 20]}
      >
        <Animated.View style={style}>
          <Card padding="s" flexDirection="row" alignItems="center">
            {product.product?.image && (
              <Image
                source={{ uri: product.product.image }}
                style={styles.image}
              />
            )}
            <Box
              padding="m"
              justifyContent="space-between"
              alignSelf="stretch"
              flex={1}
            >
              <Box justifyContent="space-between" flexDirection="row">
                <Box flex={1}>
                  <Text style={{ flexShrink: 1 }}>{product.product?.name}</Text>
                </Box>
                <Box>
                  <Tag>{product.product?.price}</Tag>
                </Box>
              </Box>
              <Box
                flexDirection="row"
                justifyContent="space-between"
                alignItems="flex-end"
              >
                <Box>
                  {product.option?.map((option) => (
                    <Text key={option?.name} paddingRight="m">
                      <Text variant="header3">{option?.name}:</Text>{" "}
                      {option?.value}
                    </Text>
                  ))}
                </Box>
                <Box alignItems="flex-end">
                  <Quantity
                    qty={product.quantity ?? 0}
                    limit={10}
                    onChange={(qty) => {
                      updateCart({ variables: { key: product.key, qty } });
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Card>
        </Animated.View>
      </PanGestureHandler>
    </Box>
  );
};

export default Row;
