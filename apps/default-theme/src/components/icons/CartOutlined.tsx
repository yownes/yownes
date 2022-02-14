/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function CartOutlined({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M149.5,480.3h213.1c19.6,0,38.5-8.2,51.8-22.5c13.4-14.3,20.3-33.7,19-53.2l-15.7-237.5l0-0.1
			c-1.2-16.1-14.8-28.7-30.9-28.7h-34.5c-0.1-53-43.3-96.1-96.3-96.1c-53,0-96.2,43.1-96.3,96.1h-34.3c-16.3,0-29.8,12.7-30.9,28.9
			L78.6,404.6c-1.3,19.5,5.6,38.9,19,53.2S129.9,480.3,149.5,480.3z M256,64.2c40.9,0,74.2,33.2,74.3,74.1H181.7
			C181.8,97.4,215.1,64.2,256,64.2z M100.6,406l15.8-237.3c0.3-4.7,4.3-8.4,9-8.4h34.3V192c0,6.1,4.9,11,11,11s11-4.9,11-11v-31.7
			h148.7V192c0,6.1,4.9,11,11,11s11-4.9,11-11v-31.7h34.5c4.7,0,8.6,3.6,9,8.3l15.7,237.4c0.9,13.7-3.8,26.7-13.1,36.7
			c-9.4,10-22.1,15.5-35.8,15.5H149.5c-13.7,0-26.4-5.5-35.8-15.5C104.3,432.8,99.7,419.7,100.6,406z"
      />
    </Svg>
  );
}

export default CartOutlined;
