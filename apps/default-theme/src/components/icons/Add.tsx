/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function Add({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M347.3 63.6H164.7c-55.7 0-101 45.3-101 101v182.7c0 55.7 45.3 101 101 101h182.7c55.7 0 101-45.3 101-101V164.6c-.1-55.7-45.4-101-101.1-101zm79 283.6c0 43.6-35.4 79-79 79H164.7c-43.6 0-79-35.4-79-79V164.6c0-43.6 35.4-79 79-79h182.7c43.6 0 79 35.4 79 79v182.6z"
      />
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M341.3 245H267v-74.3c0-6.1-4.9-11-11-11s-11 4.9-11 11V245h-74.3c-6.1 0-11 4.9-11 11s4.9 11 11 11H245v74.3c0 6.1 4.9 11 11 11s11-4.9 11-11V267h74.3c6.1 0 11-4.9 11-11s-4.9-11-11-11z"
      />
    </Svg>
  );
}

export default Add;
