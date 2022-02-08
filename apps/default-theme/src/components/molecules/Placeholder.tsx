import React, { ReactNode } from "react";
import { Image } from "react-native";

import { Box, Text } from "../atoms";

interface PlaceholderProps {
  image?: string;
  View?: ReactNode;
  text: string;
}

const Placeholder = ({ image, text, View }: PlaceholderProps) => {
  return (
    <Box>
      {image && <Image source={{ uri: image }} />}
      {View}
      <Text textAlign="center">{text}</Text>
    </Box>
  );
};

export default Placeholder;
