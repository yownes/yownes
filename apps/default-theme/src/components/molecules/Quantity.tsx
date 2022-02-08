import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { Box, Text } from "../atoms";
import { useTheme } from "../../lib/theme";

interface QuantityProps {
  qty: number;
  limit: number;
  onChange: (value: number) => void;
}

const style = StyleSheet.create({
  button: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
});

const Quantity = ({ qty, limit, onChange }: QuantityProps) => {
  const theme = useTheme();
  const lessEnabled = qty > 1;
  const moreEnabled = qty < limit;
  return (
    <Box flexDirection="row" alignItems="center">
      <TouchableOpacity
        style={[
          style.button,
          {
            backgroundColor: lessEnabled
              ? theme.colors.greyscale5
              : theme.colors.greyscale2,
          },
        ]}
        onPress={() => {
          if (lessEnabled) {
            onChange(qty - 1);
          }
        }}
      >
        <Text>-</Text>
      </TouchableOpacity>
      <Text padding="m">{qty}</Text>
      <TouchableOpacity
        style={[
          style.button,
          {
            backgroundColor: moreEnabled
              ? theme.colors.greyscale5
              : theme.colors.greyscale2,
          },
        ]}
        onPress={() => {
          if (qty > 0) {
            onChange(qty + 1);
          }
        }}
      >
        <Text>+</Text>
      </TouchableOpacity>
    </Box>
  );
};

export default Quantity;
