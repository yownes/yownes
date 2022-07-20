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
  const exceded = qty > limit;
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
        <Text color={lessEnabled ? "dark" : "greyscale3"}>-</Text>
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
          if (moreEnabled) {
            onChange(qty + 1);
          }
        }}
      >
        <Text color={moreEnabled ? "dark" : "greyscale3"}>+</Text>
      </TouchableOpacity>
      {limit === -1 ? (
        <Text padding="m" variant="smallAlert">
          No disponible
        </Text>
      ) : exceded ? (
        <Text padding="m" variant="smallAlert">
          Sin stock
        </Text>
      ) : (
        !moreEnabled && (
          <Text padding="m" variant="smallAlert">
            Límite alcanzado
          </Text>
        )
      )}
    </Box>
  );
};

export default Quantity;
