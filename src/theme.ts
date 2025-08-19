// src/theme.ts
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

export const theme = extendTheme({
  fontSizes: {
    "2xs": "0.625rem",
  },

  textStyles: {
    h1: {
      fontWeight: "bold",
      lineHeight: "1.3",
      fontSize: { base: "md", md: "xl", lg: "2xl" },
    },
    h2: {
      fontWeight: "semibold",
      lineHeight: "1.3",
      fontSize: { base: "sm", md: "md", lg: "lg" },
    },
    h3: {
      fontWeight: "medium",
      lineHeight: "1.3",
      fontSize: { base: "xs", md: "md", lg: "md" },
    },
    p: {
      fontWeight: "normal",
      lineHeight: "1.5",
      fontSize: { base: "2xs", md: "sm", lg: "sm" },
    },
    "caption-1": {
      fontWeight: "semibold",
      lineHeight: "1.2",
      fontSize: { base: "2xs", md: "sm", lg: "sm" },
    },
    "caption-2": {
      fontWeight: "normal",
      lineHeight: "1.2",
      fontSize: { base: "2xs", md: "sm", lg: "sm" },
    },
  },

  styles: {
    global: {
      ".h1": {
        fontWeight: 700,
        lineHeight: "1.3",
        fontSize: { base: "md", md: "xl", lg: "4xl" },
      },
      ".h2": {
        fontWeight: 600,
        lineHeight: "1.3",
        fontSize: { base: "sm", md: "md", lg: "lg" },
      },
      ".h3": {
        fontWeight: 500,
        lineHeight: "1.3",
        fontSize: { base: "xs", md: "md", lg: "md" },
      },
      ".p": {
        fontWeight: 400,
        lineHeight: "1.5",
        fontSize: { base: "2xs", md: "sm", lg: "sm" },
      },
      ".caption-1": {
        fontWeight: 600,
        lineHeight: "1.2",
        fontSize: { base: "2xs", md: "sm", lg: "sm" },
      },
      ".caption-2": {
        fontWeight: 400,
        lineHeight: "1.2",
        fontSize: { base: "2xs", md: "sm", lg: "sm" },
      },
    },
  },

  components: {
    Table: {
      variants: {
        unifiedFlat: (props: any) => {
          const border = mode("gray.200", "gray.700")(props);
          const hover = mode("gray.50", "gray.800")(props);

          const base = {
            px: "12px",
            py: "10px",
            lineHeight: "20px",
            textTransform: "none",
            letterSpacing: "normal",
            verticalAlign: "middle",
            borderBottomWidth: "1px",
            borderColor: border,
            bg: "transparent",
          };

          const caption1 = props.theme.textStyles?.["caption-1"] ?? {};
          const caption2 = props.theme.textStyles?.["caption-2"] ?? {};

          return {
            thead: { tr: { th: { ...base, ...caption1 } } },
            tbody: {
              tr: {
                _hover: { bg: hover },
                td: { ...base, ...caption2 },
                "&:last-of-type td": { borderBottomWidth: 0 },
              },
            },
          };
        },
      },
      defaultProps: {
        variant: "unifiedFlat",
        size: "md",
      },
    },

    Badge: {
      baseStyle: (props: any) => ({
        ...(props.theme.textStyles?.["caption-1"] ?? {}),
        textTransform: "none",
      }),
    },
  },
});
