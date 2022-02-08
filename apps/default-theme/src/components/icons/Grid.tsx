/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import { IconProps } from "./types";

function Grid({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M230.4 0H8.533A8.534 8.534 0 000 8.533V230.4a8.533 8.533 0 008.533 8.533H230.4a8.533 8.533 0 008.533-8.533V8.533A8.533 8.533 0 00230.4 0zm-8.533 221.867h-204.8v-204.8h204.8v204.8zM230.4 273.067H8.533A8.534 8.534 0 000 281.6v221.867A8.534 8.534 0 008.533 512H230.4a8.533 8.533 0 008.533-8.533V281.6a8.533 8.533 0 00-8.533-8.533zm-8.533 221.866h-204.8v-204.8h204.8v204.8zM503.467 0H281.6a8.533 8.533 0 00-8.533 8.533V230.4a8.533 8.533 0 008.533 8.533h221.867A8.533 8.533 0 00512 230.4V8.533A8.534 8.534 0 00503.467 0zm-8.534 221.867h-204.8v-204.8h204.8v204.8zM503.467 273.067H281.6a8.533 8.533 0 00-8.533 8.533v221.867A8.533 8.533 0 00281.6 512h221.867a8.533 8.533 0 008.533-8.533V281.6a8.534 8.534 0 00-8.533-8.533zm-8.534 221.866h-204.8v-204.8h204.8v204.8z"
      />
    </Svg>
  );
}

export default Grid;
