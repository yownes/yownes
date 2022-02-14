/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function FavouriteOutlined({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M469.3 207.5c-1.5-4.5-5.7-7.6-10.5-7.6H311.9L266.5 60.1c-1.5-4.5-5.7-7.6-10.5-7.6s-9 3.1-10.5 7.6l-45.4 139.8H53.2c-4.8 0-9 3.1-10.5 7.6s.1 9.5 4 12.3l118.9 86.4L120.2 446c-1.5 4.5.1 9.5 4 12.3 3.9 2.8 9.1 2.8 12.9 0L256 371.8l118.9 86.4c1.9 1.4 4.2 2.1 6.5 2.1s4.5-.7 6.5-2.1c3.9-2.8 5.5-7.8 4-12.3l-45.4-139.8 118.9-86.4c3.7-2.7 5.4-7.7 3.9-12.2zM327 293.1c-3.9 2.8-5.5 7.8-4 12.3l37.4 115.2-98-71.2c-1.9-1.4-4.2-2.1-6.5-2.1s-4.5.7-6.5 2.1l-98 71.2L189 305.4c1.5-4.5-.1-9.5-4-12.3l-98-71.2h121.1c4.8 0 9-3.1 10.5-7.6L256 99.1l37.4 115.2c1.5 4.5 5.7 7.6 10.5 7.6H425l-98 71.2z"
      />
    </Svg>
  );
}

export default FavouriteOutlined;
