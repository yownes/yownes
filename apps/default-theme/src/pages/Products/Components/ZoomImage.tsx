import React from "react";
import { Dimensions } from "react-native";
import {
  PinchGestureHandler,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useVector, Vector, transformOrigin } from "react-native-redash";

const { width, height } = Dimensions.get("screen");

const CENTER: Vector = {
  x: width / 2,
  y: height / 2,
};

interface ZoomImageProps {
  image: string;
}

const ZoomImage = ({ image }: ZoomImageProps) => {
  const focal = useVector(0, 0);
  const imageScale = useSharedValue(1);
  const onPinchGestureEvent = useAnimatedGestureHandler<PinchGestureHandlerGestureEvent>(
    {
      onActive: ({ focalX, focalY, scale }) => {
        focal.x.value = focalX - CENTER.x;
        focal.y.value = focalY - CENTER.y;
        imageScale.value = scale;
      },
      onEnd() {
        imageScale.value = withTiming(1);
      },
    }
  );
  const style = useAnimatedStyle(() => {
    return {
      transform: transformOrigin({ x: focal.x.value, y: focal.y.value }, [
        { scale: imageScale.value },
      ]),
      flex: 1,
    };
  });
  return (
    <PinchGestureHandler onGestureEvent={onPinchGestureEvent}>
      <Animated.View style={{ width, height }}>
        <Animated.Image source={{ uri: image }} style={style} />
      </Animated.View>
    </PinchGestureHandler>
  );
};

export default ZoomImage;
