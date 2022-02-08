import React from "react";
import { StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { mix, mixColor } from "react-native-redash";

import { useTheme } from "../../lib/theme";

const size = 20;
const styles = StyleSheet.create({
  container: {
    height: size,
    width: size,
    borderRadius: size / 2,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#525251",
  },
});

interface ChevronProps {
  progress: Animated.SharedValue<number>;
}

const Chevron = ({ progress }: ChevronProps) => {
  const theme = useTheme();
  const style = useAnimatedStyle(() => ({
    backgroundColor: mixColor(
      progress.value,
      theme.colors.greyscale2,
      theme.colors.primary
    ),
    transform: [{ rotateZ: `${mix(progress.value, 0, Math.PI)}rad` }],
  }));
  return (
    <Animated.View style={[styles.container, style]}>
      <Svg
        width={20}
        height={20}
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <Path d="M6 9l6 6 6-6" />
      </Svg>
    </Animated.View>
  );
};

export default Chevron;
