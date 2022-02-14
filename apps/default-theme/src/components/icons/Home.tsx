/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function Home({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M452.5 149.4l-20.6-61.9c-4.8-14.3-18.1-23.9-33.2-23.9H113.3c-15.1 0-28.4 9.6-33.2 23.9l-20.6 61.9c-4.3 13-6.5 26.5-6.5 40.1v3.9c0 17.1 13.9 31 31 31h344c17.1 0 31-13.9 31-31v-3.9c0-13.7-2.2-27.2-6.5-40.1zM437.7 246.3H74.3v166.9c0 19.3 15.7 35 35 35h73.3c17.1 0 31-13.9 31-31v-98.5c0-5 4-9 9-9h66.7c5 0 9 4 9 9v98.5c0 17.1 13.9 31 31 31h73.3c19.3 0 35-15.7 35-35V246.3z"
      />
    </Svg>
  );
}

export default Home;
