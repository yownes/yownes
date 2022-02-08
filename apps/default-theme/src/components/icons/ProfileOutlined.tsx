/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import { IconProps } from "./types";

function Shipment({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M112.5 313.6L89.6 418.4c-3.3 15.2.4 30.8 10.1 42.9 9.7 12.1 24.2 19 39.7 19h228.3c15.2 0 29.6-6.7 39.3-18.5s13.7-27.1 10.8-42.1l-19.7-103.4c-9.1-47.6-50.8-82.1-99.2-82.1h-87.7c-23 0-45.4 7.9-63.3 22.3s-30.5 34.7-35.4 57.1zm98.7-57.4h87.7c37.9 0 70.5 27 77.6 64.2l19.7 103.4c1.6 8.5-.6 17.2-6.1 23.9-5.5 6.7-13.7 10.5-22.3 10.5H139.4c-8.8 0-17.1-3.9-22.6-10.8s-7.6-15.8-5.7-24.4L134 318.3c7.9-36 40.3-62.1 77.2-62.1zM341.7 127.9c0-47.2-38.4-85.7-85.7-85.7s-85.7 38.4-85.7 85.7 38.4 85.7 85.7 85.7 85.7-38.5 85.7-85.7zm-149.4 0c0-35.1 28.6-63.7 63.7-63.7s63.7 28.6 63.7 63.7-28.6 63.7-63.7 63.7-63.7-28.6-63.7-63.7z"
      />
    </Svg>
  );
}

export default Shipment;
