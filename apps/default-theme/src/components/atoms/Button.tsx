import {
  ColorProps,
  createBox,
  useResponsiveProp,
  useTheme,
} from "@shopify/restyle";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

import { Theme } from "../../lib/theme";

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
      backgroundColor={backgroundColor}
      {...props}
    >
      <Text
        variant="buttonLabel"
        color={color}
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
