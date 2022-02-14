/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function Location({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M85 214c.2 2.3 4.3 56.4 35.1 98.3 29.2 39.6 123.5 148.8 127.5 153.5l8.3 9.6 8.3-9.6c4-4.6 98.4-113.8 127.5-153.5 30.8-41.8 35-96 35.1-98.3v-.8c0-94.3-76.7-171-171-171s-171 76.7-171 171l.2.8zM256 64.2c82 0 148.8 66.6 149 148.6-.4 4.5-5 51.3-30.9 86.4-23.7 32.2-93.9 114.3-118.1 142.5-24.2-28.2-94.5-110.3-118.1-142.5-25.8-35-30.5-82-30.9-86.5.2-81.9 67-148.5 149-148.5z"
      />
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M256 308.9c52.8 0 95.7-42.9 95.7-95.7 0-52.8-42.9-95.7-95.7-95.7-52.8 0-95.7 42.9-95.7 95.7 0 52.8 43 95.7 95.7 95.7zm0-169.3c40.6 0 73.7 33 73.7 73.7 0 40.6-33 73.7-73.7 73.7-40.6 0-73.7-33-73.7-73.7s33.1-73.7 73.7-73.7z"
      />
    </Svg>
  );
}

export default Location;
