import type { ReactNode } from "react";
import React from "react";

import Box from "./Box";
import Text from "./Text";

interface TagProps {
  children: ReactNode;
  light?: boolean;
}

const Tag = ({ children, light }: TagProps) => {
  return (
    <Box
      backgroundColor={light ? "greyscale3" : "primary"}
      paddingVertical="s"
      paddingHorizontal="m"
    >
      <Text variant="buttonLabel" color="white">
        {children}
      </Text>
    </Box>
  );
};

export default Tag;
