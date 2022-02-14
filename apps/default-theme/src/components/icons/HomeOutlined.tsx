/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import type { IconProps } from "./types";

function HomeOutlined({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M452.5,149.4l-20.6-61.9c-4.8-14.3-18.1-23.9-33.2-23.9H113.3c-15.1,0-28.4,9.6-33.2,23.9l-20.6,61.9
			c-4.3,13-6.5,26.5-6.5,40.1v3.9c0,13.7,9,25.4,21.3,29.4v190.4c0,19.3,15.7,35,35,35h73.3c17.1,0,31-13.9,31-31v-98.5c0-5,4-9,9-9
			h66.7c5,0,9,4,9,9v98.5c0,17.1,13.9,31,31,31h73.3c19.3,0,35-15.7,35-35V222.8C450,218.7,459,207,459,193.3v-3.9
			C459,175.8,456.8,162.3,452.5,149.4z M75,189.5c0-11.3,1.8-22.5,5.4-33.2L101,94.4c1.8-5.3,6.7-8.9,12.3-8.9h285.4
			c5.6,0,10.6,3.6,12.3,8.9l20.6,61.9c3.6,10.7,5.4,21.9,5.4,33.2v3.9c0,5-4,9-9,9H84c-5,0-9-4-9-9V189.5z M402.7,426.2h-73.3
			c-5,0-9-4-9-9v-98.5c0-17.1-13.9-31-31-31h-66.7c-17.1,0-31,13.9-31,31v98.5c0,5-4,9-9,9h-73.3c-7.2,0-13-5.8-13-13V224.3h319.3
			v188.9C415.7,420.4,409.8,426.2,402.7,426.2z"
      />
    </Svg>
  );
}

export default HomeOutlined;
