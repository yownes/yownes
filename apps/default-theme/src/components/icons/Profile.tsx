/* eslint-disable max-len */
import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import { IconProps } from "./types";

function Shipment({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M112.5 313.6L89.6 418.4c-3.3 15.2.4 30.8 10.1 42.9 9.7 12.1 24.2 19 39.7 19h228.3c15.2 0 29.6-6.7 39.3-18.5 9.7-11.7 13.7-27.1 10.8-42.1l-19.7-103.4c-9.1-47.6-50.8-82.1-99.2-82.1h-87.7c-23 0-45.4 7.9-63.3 22.3s-30.5 34.7-35.4 57.1z"
      />
      <Circle
        fill={theme.colors[color ?? "dark"]}
        cx={256}
        cy={127.9}
        r={85.7}
      />
    </Svg>
  );
}

export default Shipment;
