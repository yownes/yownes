/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function Categories({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M73.3 426.9h269.3c17.1 0 31-13.9 31-31v-43H169.3c-29.2 0-53-23.8-53-53v-23h-43c-17.1 0-31 13.9-31 31v88c0 17.1 13.9 31 31 31zM73.3 234.9h43v-23c0-29.2 23.8-53 53-53h204.3v-43c0-17.1-13.9-31-31-31H73.3c-17.1 0-31 13.9-31 31v88c0 17.1 13.9 31 31 31z"
      />
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M138.3 211.9v88c0 17.1 13.9 31 31 31h269.3c17.1 0 31-13.9 31-31v-88c0-17.1-13.9-31-31-31H169.3c-17.1 0-31 13.9-31 31z"
      />
    </Svg>
  );
}

export default Categories;
