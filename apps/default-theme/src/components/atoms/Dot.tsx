import React from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import { useTheme } from "../../lib/theme";

interface DotProps {
  selected: Animated.SharedValue<boolean>;
}

const DOT_SIZE = 6;

const styles = StyleSheet.create({
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
});

const Dot = ({ selected }: DotProps) => {
  const theme = useTheme();
  const style = useAnimatedStyle(() => ({
    backgroundColor: selected.value ? theme.colors.dark : "transparent",
    borderColor: theme.colors.dark,
    borderWidth: 1,
  }));
  return <Animated.View style={[styles.dot, style]} />;
};

export default Dot;
