import type { ReactNode } from "react";
import type {
  LayoutProps,
  SpacingProps,
  VariantProps,
  BackgroundColorProps,
} from "@shopify/restyle";
import {
  createRestyleComponent,
  createVariant,
  spacing,
  layout,
  backgroundColor,
} from "@shopify/restyle";

import type { Theme } from "../../lib/theme";

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
