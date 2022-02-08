import React from "react";
import { View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSpring } from "react-native-redash";

import { useTheme } from "../../lib/theme";

interface RadioButtonProps {
  active: boolean;
}

const SIZE = 20;
const DOT_SIZE = SIZE * 0.6;

const RadioButton = ({ active }: RadioButtonProps) => {
  const theme = useTheme();
  const transition = useSpring(active);
  const style = useAnimatedStyle(() => {
    const size = interpolate(transition.value, [0, 1], [0, DOT_SIZE]);
    return {
      width: size,
      height: size,

      borderRadius: DOT_SIZE / 2,
      backgroundColor: theme.colors.primary,
    };
  });
  return (
    <View
      style={{
        width: SIZE,
        height: SIZE,
        borderRadius: SIZE / 2,
        borderColor: theme.colors.black,
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Animated.View style={style} />
    </View>
  );
};

export default RadioButton;
