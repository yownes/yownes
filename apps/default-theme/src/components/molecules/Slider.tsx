import type { ReactNode } from "react";
import React, { Children } from "react";
import { Dimensions, ScrollView } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";

import useMeasure from "../../lib/hooks/useMeasure";
import { Box, Dot } from "../atoms";

interface SliderProps {
  children: ReactNode[];
}

interface AnimatedDotProps {
  actual: Animated.SharedValue<number>;
  index: number;
}
interface AnimatedViewProps {
  index: number;
  translationX: Animated.SharedValue<number>;
  view: ReactNode;
  width: number;
}

const { width } = Dimensions.get("window");

const PADDING = 20;

const AnimatedDot = ({ actual, index }: AnimatedDotProps) => {
  const selected = useDerivedValue(() => actual.value === index);
  return (
    <Box padding="m">
      <Dot selected={selected} />
    </Box>
  );
};

const AnimatedView = ({
  translationX,
  index,
  view,
  width: viewWidth,
}: AnimatedViewProps) => {
  const style = useAnimatedStyle(() => {
    const w = viewWidth;
    const inputRange = [(index - 1) * w, index * w, (index + 1) * w];
    const translateX = interpolate(
      translationX.value,
      inputRange,
      [(-w + PADDING) / 2, 0, (w - PADDING) / 2],
      Extrapolate.CLAMP
    );
    const rotate = interpolate(
      translationX.value,
      inputRange,
      [Math.PI / 2, 0, -Math.PI / 2],
      Extrapolate.CLAMP
    );
    const scale = interpolate(
      translationX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );
    return {
      width: w,
      transform: [{ translateX }, { rotateY: `${rotate}rad` }, { scale }],
    };
  });
  return <Animated.View style={style}>{view}</Animated.View>;
};

const Slider = ({ children }: SliderProps) => {
  const translationX = useSharedValue(0);
  const idx = useDerivedValue(() => Math.round(translationX.value / width));
  const onScroll = useAnimatedScrollHandler({
    onScroll({ contentOffset }) {
      translationX.value = contentOffset.x;
    },
  });
  const [aref, measured] = useMeasure<Animated.ScrollView>(width);
  return (
    <>
      <Animated.ScrollView
        horizontal
        onScroll={onScroll}
        snapToInterval={measured}
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        scrollEventThrottle={16}
        ref={aref}
      >
        {Children.map(children, (view, i) => (
          <AnimatedView
            key={i}
            view={view}
            index={i}
            width={measured}
            translationX={translationX}
          />
        ))}
      </Animated.ScrollView>
      <Box justifyContent="center" flexDirection="row">
        {Children.map(children, (_, i) => (
          <AnimatedDot index={i} actual={idx} key={i} />
        ))}
      </Box>
    </>
  );
};

export default Slider;
