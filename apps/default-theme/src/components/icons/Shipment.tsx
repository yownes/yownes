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
        d="M426.9 148.1c0-.4-.1-.7-.2-1.1 0-.2-.1-.4-.2-.6 0-.2-.1-.3-.1-.5 0-.1 0-.1-.1-.2l-.3-.9s0-.1-.1-.1c-.1-.3-.3-.6-.4-.9L375.1 53c-3.7-6.7-10.7-10.8-18.4-10.8H155.2c-7.6 0-14.7 4.1-18.4 10.8l-50.5 90.9c-.2.3-.3.6-.4.9 0 0 0 .1-.1.1l-.3.9c0 .1 0 .1-.1.2 0 .2-.1.3-.1.5-.1.2-.1.4-.2.6-.1.3-.1.7-.2 1 0 .4-.1.7-.1 1.1v289.3c0 17.1 13.9 31 31 31h280c17.1 0 31-13.9 31-31V149.2c.2-.4.2-.7.1-1.1zm-29.6-9.9H267v-74h89.2l41.1 74zm-241.5-74H245v74H114.7l41.1-74zM405 438.6c0 5-4 9-9 9H116c-5 0-9-4-9-9V160.2h298v278.4z"
      />
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M210.8 293.9c-4.3-4.3-11.3-4.3-15.6 0-4.3 4.3-4.3 11.3 0 15.6l36.8 36.8c2.1 2.1 4.9 3.2 7.8 3.2s5.7-1.2 7.8-3.2l69.2-69.2c4.3-4.3 4.3-11.3 0-15.6-4.3-4.3-11.3-4.3-15.6 0l-61.4 61.4-29-29z"
      />
    </Svg>
  );
}

export default Shipment;
