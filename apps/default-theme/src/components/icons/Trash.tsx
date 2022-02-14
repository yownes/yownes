/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function Trash({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M386 95.7h-55V73.2c0-17.1-13.9-31-31-31h-88c-17.1 0-31 13.9-31 31v22.4h-55c-22.6 0-41 18.4-41 41v23.2c0 6.1 4.9 11 11 11h11.4l29 271c1.7 15.8 14.9 27.7 30.8 27.7h177.4c15.9 0 29.1-11.9 30.8-27.7l29-271H416c6.1 0 11-4.9 11-11v-23.2c0-22.5-18.4-40.9-41-40.9zM203 73.2c0-5 4-9 9-9h88c5 0 9 4 9 9v22.4H203V73.2zm-96 63.5c0-10.5 8.5-19 19-19h260c10.5 0 19 8.5 19 19v12.2H107v-12.2zm246.6 302.8c-.5 4.6-4.3 8-8.9 8H167.3c-4.6 0-8.5-3.5-8.9-8l-28.8-268.6h252.9l-28.9 268.6z"
      />
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M256 426.9c6.1 0 11-4.9 11-11V202.6c0-6.1-4.9-11-11-11s-11 4.9-11 11v213.3c0 6.1 4.9 11 11 11zM309.3 426.9c6.1 0 11-4.9 11-11V202.6c0-6.1-4.9-11-11-11s-11 4.9-11 11v213.3c0 6.1 5 11 11 11zM202.7 426.9c6.1 0 11-4.9 11-11V202.6c0-6.1-4.9-11-11-11s-11 4.9-11 11v213.3c0 6.1 4.9 11 11 11z"
      />
    </Svg>
  );
}

export default Trash;
