import { ReactNode } from "react";
import {
  createRestyleComponent,
  createVariant,
  LayoutProps,
  spacing,
  layout,
  backgroundColor,
  SpacingProps,
  VariantProps,
  BackgroundColorProps,
} from "@shopify/restyle";

import { Theme } from "../../lib/theme";

type Props = SpacingProps<Theme> &
  LayoutProps<Theme> &
  BackgroundColorProps<Theme> &
  VariantProps<Theme, "cardVariants"> & {
    children: ReactNode;
  };

const Card = createRestyleComponent<Props, Theme>([
  spacing,
  layout,
  backgroundColor,
  createVariant({ themeKey: "cardVariants" }),
]);

export default Card;
