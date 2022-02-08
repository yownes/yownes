/* eslint-disable max-len */
import React from "react";
import Svg, { Path } from "react-native-svg";

import { useTheme } from "../../lib/theme";

import { IconProps } from "./types";

function CategoriesOutlined({ size, color }: IconProps) {
  const theme = useTheme();
  return (
    <Svg viewBox="0 0 512 512" width={size ?? 30} height={size ?? 30}>
      <Path
        fill={theme.colors[color ?? "dark"]}
        d="M73.3,426.9h269.3c17.1,0,31-13.9,31-31v-65h65c17.1,0,31-13.9,31-31v-88c0-17.1-13.9-31-31-31h-65v-65
			c0-17.1-13.9-31-31-31H73.3c-17.1,0-31,13.9-31,31v88c0,17.1,13.9,31,31,31h65v42h-65c-17.1,0-31,13.9-31,31v88
			C42.3,413,56.2,426.9,73.3,426.9z M447.7,211.9v88c0,5-4,9-9,9H169.3c-5,0-9-4-9-9v-88c0-5,4-9,9-9h269.3
			C443.6,202.9,447.7,206.9,447.7,211.9z M73.3,212.9c-5,0-9-4-9-9v-88c0-5,4-9,9-9h269.3c5,0,9,4,9,9v65H169.3
			c-17.1,0-31,13.9-31,31v1H73.3z M64.3,307.9c0-5,4-9,9-9h65v1c0,17.1,13.9,31,31,31h182.3v65c0,5-4,9-9,9H73.3c-5,0-9-4-9-9V307.9
			z"
      />
    </Svg>
  );
}

export default CategoriesOutlined;
