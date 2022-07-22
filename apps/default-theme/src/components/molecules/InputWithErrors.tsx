import React, { ReactNode } from "react";
import type { TextInputProps } from "react-native";

import { useTheme } from "../../lib/theme";
import { Input, Text } from "../atoms";

interface InputWithErrorsProps extends TextInputProps {
  error?: string;
  separator?: ReactNode;
}

const InputWithErrors = ({
  error,
  separator,
  style,
  ...rest
}: InputWithErrorsProps) => {
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
      {separator ?? null}
    </>
  );
};

export default InputWithErrors;
