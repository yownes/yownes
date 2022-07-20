import { createTheme, useTheme as useRestyleTheme } from "@shopify/restyle";

const palette = {
  green: "#00e39c",
  black: "black",
  danger: "#ff0000",
  greyscale1: "#ffffff",
  greyscale2: "#ededed",
  greyscale3: "#9b9b9b",
  greyscale4: "#606060",
  greyscale5: "#dddddd",
  greyscale6: "#262626",
  transparent: "transparent",
  yellow: "#f8c133",
};

const theme = createTheme({
  colors: {
    primary: palette.green,
    danger: palette.danger,
    dark: palette.greyscale6,
    background: palette.greyscale2,
    black: palette.black,
    white: palette.greyscale1,
    textColor: palette.black,
    greyscale2: palette.greyscale2,
    greyscale3: palette.greyscale3,
    greyscale4: palette.greyscale4,
    greyscale5: palette.greyscale5,
    transparent: palette.transparent,
    yellow: palette.yellow,
  },
  spacing: {
    s: 2,
    m: 10,
    l: 20,
    xl: 40,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    header: {
      fontWeight: "bold",
      fontSize: 22,
      color: "dark",
    },
    header2: {
      fontWeight: "600",
      fontSize: 16,
    },
    header3: {
      fontWeight: "bold",
      fontSize: 12,
    },
    header4: {
      fontWeight: "bold",
      fontSize: 12,
      textTransform: "uppercase",
    },
    body: {
      fontSize: 12,
      color: "dark",
    },
    buttonLabel: {
      fontSize: 14,
      lineHeight: 24,
      fontWeight: "bold",
      textTransform: "uppercase",
    },
    small: {
      fontSize: 10,
      color: "dark",
    },
    smallAlert: {
      fontSize: 10,
      color: "danger",
    },
    throughBody: {
      fontSize: 12,
      color: "greyscale3",
      textDecorationLine: "line-through",
      textDecorationStyle: "solid",
    },
    throughSmall: {
      fontSize: 10,
      color: "dark",
      textDecorationLine: "line-through",
      textDecorationStyle: "solid",
    },
  },
  cardVariants: {
    defaults: {
      // We can define defaults for the variant here.
      // This will be applied after the defaults passed to createVariant and before the variant defined below.
      backgroundColor: "white",
    },
    regular: {
      // We can refer to other values in the theme here, and use responsive props
      padding: {
        phone: "s",
        tablet: "m",
      },
    },
    elevated: {
      padding: {
        phone: "s",
        tablet: "m",
      },
      shadowColor: "dark",
      shadowOpacity: 0.2,
      shadowOffset: { width: 0, height: 5 },
      shadowRadius: 15,
      elevation: 5,
      borderRadius: 10,
    },
  },
});

export type Theme = typeof theme;

export const useTheme = () => useRestyleTheme<Theme>();

export default theme;
