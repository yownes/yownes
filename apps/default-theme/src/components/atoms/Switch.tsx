import React from "react";
import { Switch as BaseSwitch } from "react-native";

import { useTheme } from "../../lib/theme";

interface SwitchProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

const Switch = ({ value, onChange }: SwitchProps) => {
  const theme = useTheme();
  return (
    <BaseSwitch
      trackColor={{
        false: theme.colors.greyscale3,
        true: theme.colors.primary,
      }}
      value={value}
      onValueChange={onChange}
    />
  );
};

export default Switch;
