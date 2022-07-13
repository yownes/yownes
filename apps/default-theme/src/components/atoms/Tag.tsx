import type { ReactNode } from "react";
import React from "react";

import Box from "./Box";
import Text from "./Text";

interface TagProps {
  children: ReactNode;
  fixedWidth?: boolean;
  light?: boolean;
}

const Tag = ({ children, fixedWidth, light }: TagProps) => {
  return (
    <Box
      backgroundColor={light ? "greyscale3" : "primary"}
      minWidth={fixedWidth ? 80 : null}
      paddingVertical="s"
      paddingHorizontal="m"
      alignItems="center"
    >
      <Text variant="buttonLabel" color="white">
        {children}
      </Text>
    </Box>
  );
};

export default Tag;
