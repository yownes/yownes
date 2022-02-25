import React from "react";
import { Dimensions } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { snapPoint, useVector } from "react-native-redash";
import { SharedElement } from "react-navigation-shared-element";

import type { ImagesProps } from "../../navigation/Product";

import ZoomImage from "./Components/ZoomImage";

const { width, height } = Dimensions.get("screen");

const Images = ({ route, navigation }: ImagesProps) => {
  const { product, index } = route.params;
  const isGestureActive = useSharedValue(false);
  const scrollPosition = useSharedValue(width * index);
  const translation = useVector();
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: () => (isGestureActive.value = true),
    onActive: ({ translationX, translationY }) => {
      translation.x.value = translationX;
      translation.y.value = translationY;
    },
    onEnd: ({ translationY, velocityY }) => {
      const snapBack =
        snapPoint(translationY, velocityY, [0, height]) === height;

      if (snapBack) {
        runOnJS(navigation.navigate)({
          name: "Product",
          params: {
            id: String(product.id),
            index: scrollPosition.value / width,
          },
        });
      } else {
        isGestureActive.value = false;
        translation.x.value = withSpring(0);
        translation.y.value = withSpring(0);
      }
    },
  });
  const style = useAnimatedStyle(() => {
    const scale = interpolate(
      translation.y.value,
      [0, height],
      [1, 0.5],
      Extrapolate.CLAMP
    );
    return {
      flex: 1,
      transform: [
        { translateX: translation.x.value * scale },
        { translateY: translation.y.value * scale },
        { scale },
      ],
    };
  });
  const onScroll = useAnimatedScrollHandler({
    onScroll({ contentOffset }) {
      scrollPosition.value = contentOffset.x;
    },
  });
  const IMAGES: string[] = [
    product?.image,
    ...(product?.images?.map((img) => img?.imageBig) ?? []),
  ]
    .filter(
      (str: string | null | undefined) => str !== null && str !== undefined
    )
    .map((img) => img as string);
  return (
    <PanGestureHandler onGestureEvent={onGestureEvent}>
      <Animated.View style={style}>
        <Animated.ScrollView
          contentOffset={{ x: width * index, y: 0 }}
          horizontal
          snapToInterval={width}
          onScroll={onScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
        >
          {IMAGES.map((image, i) => (
            <SharedElement key={i} id={`image.${i}.${product.id}`}>
              <ZoomImage image={image} />
            </SharedElement>
          ))}
        </Animated.ScrollView>
      </Animated.View>
    </PanGestureHandler>
  );
};

export default Images;
