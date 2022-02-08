import React from "react";
import { TextInputProps } from "react-native";

import { useTheme } from "../../lib/theme";
import { Input, Text } from "../atoms";

interface InputWithErrorsProps extends TextInputProps {
  error?: string;
}

const InputWithErrors = ({ error, style, ...rest }: InputWithErrorsProps) => {
  const theme = useTheme();
  return (
    <>
      <Input
        style={[
          style,
          Boolean(error) && { borderBottomColor: theme.colors.danger },
        ]}
        {...rest}
      />
      {Boolean(error) && <Text color="danger">{error}</Text>}
    </>
  );
};

export default InputWithErrors;
