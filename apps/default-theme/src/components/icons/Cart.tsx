/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import { IconProps } from "./types";

function Cart({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M417.7 167c-1.2-16.1-14.8-28.7-30.9-28.7h-34.5V192c0 6.1-4.9 11-11 11s-11-4.9-11-11v-53.7H181.7V192c0 6.1-4.9 11-11 11s-11-4.9-11-11v-53.7h-34.3c-16.3 0-29.8 12.7-30.9 28.9L78.6 404.6c-1.3 19.5 5.6 38.9 19 53.2 13.4 14.3 32.3 22.5 51.8 22.5h213.1c19.6 0 38.5-8.2 51.8-22.5 13.4-14.3 20.3-33.7 19-53.2L417.7 167zM256 64.2c40.9 0 74.2 33.2 74.3 74.1h22c-.1-53-43.3-96.1-96.3-96.1s-96.2 43.1-96.3 96.1h22c.1-40.9 33.4-74.1 74.3-74.1z"
      />
    </Svg>
  );
}

export default Cart;
