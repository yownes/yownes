import type { ColorProps } from "@shopify/restyle";
import { createBox, useResponsiveProp, useTheme } from "@shopify/restyle";
import type { ReactNode } from "react";
import React from "react";
import type { TouchableOpacityProps } from "react-native";
import { ActivityIndicator, TouchableOpacity } from "react-native";

import type { Theme } from "../../lib/theme";

import Text from "./Text";

const BaseButton = createBox<
  Theme,
  TouchableOpacityProps & {
    children: ReactNode;
  }
>(TouchableOpacity);

type Props = Omit<
  React.ComponentProps<typeof BaseButton> &
    ColorProps<Theme> & {
      label: string;
      isLoading?: boolean;
    },
  "children"
>;

const Button = ({
  label,
  isLoading,
  color = "white",
  backgroundColor = "primary",
  ...props
}: Props) => {
  const theme = useTheme<Theme>();
  const textColorProp = useResponsiveProp(color);
  return (
    <BaseButton
      flexDirection="row"
      padding="m"
      borderRadius={5}
      justifyContent="center"
      backgroundColor={props.disabled ? "greyscale5" : backgroundColor}
      onPress={() => {
        if (!isLoading) {
          props.onPress;
        }
      }}
      {...props}
    >
      <Text
        variant="buttonLabel"
        color={props.disabled ? "greyscale4" : color}
        marginRight={isLoading ? "s" : undefined}
      >
        {label}
      </Text>
      {isLoading ? (
        <ActivityIndicator
          color={textColorProp ? theme.colors[textColorProp] : undefined}
        />
      ) : null}
    </BaseButton>
  );
};

export default Button;
