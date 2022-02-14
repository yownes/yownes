/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function List({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg width={size ?? 30} height={size ?? 30} viewBox="0 0 475.508 475.508">
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M475.508 149.852H0V63.343h475.508v86.509zM15.143 134.708h445.222V78.486H15.143v56.222zM475.508 281.008H0V194.5h475.508v86.508zM15.143 265.865h445.222v-56.222H15.143v56.222zM475.508 412.165H0v-86.509h475.508v86.509zM15.143 397.021h445.222V340.8H15.143v56.221z"
      />
    </Svg>
  );
}

export default List;
