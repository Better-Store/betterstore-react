import {
  Appearance as StripeAppearance,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import { useEffect } from "react";
import { appearance as stripeAppearance } from "../payment-element/appearance";

export type Themes = "dark" | "light";
export type AppearanceConfig = {
  theme?: Themes;
  borderRadius?: number;
  font?: string;
  colors?: {
    background?: string;
    foreground?: string;
    primary?: string;
    primaryForeground?: string;
    secondary?: string;
    secondaryForeground?: string;
    muted?: string;
    mutedForeground?: string;
    accent?: string;
    accentForeground?: string;
    destructive?: string;
    border?: string;
    ring?: string;
  };
};

export default function Appearance({
  appearance,
}: {
  appearance?: AppearanceConfig;
}) {
  useEffect(() => {
    const variables = getVariablesFromAppearanceConfig(appearance);

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        document.documentElement.style.setProperty(key, value);
      });
    }
  }, [appearance]);

  return null;
}

const getVariablesFromAppearanceConfig = (appearance?: AppearanceConfig) => {
  const colors = getColorVariablesFromAppearanceConfig(appearance);
  const definedAppearance = {
    ...colors,
    "--bs-font-sans":
      appearance?.font ??
      '-apple-system, BlinkMacSystemFont, "Helvetica", "Gill Sans", "Inter", sans-serif',
    "--bs-radius": appearance?.borderRadius
      ? `${appearance.borderRadius}rem`
      : "0.625rem",
  };

  return definedAppearance;
};

const getColorVariablesFromAppearanceConfig = (
  appearance?: AppearanceConfig
) => {
  // Determine if we're using dark theme
  const isDark = appearance?.theme === "dark";

  // Define fallback colors based on theme
  const fallbackColors = {
    background: isDark ? "oklch(0.145 0 0)" : "oklch(1 0 0)",
    foreground: isDark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)",
    card: isDark ? "oklch(0.145 0 0)" : "oklch(1 0 0)",
    cardForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)",
    primary: isDark ? "oklch(0.985 0 0)" : "oklch(0.205 0 0)",
    primaryForeground: isDark ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)",
    secondary: isDark ? "oklch(0.269 0 0)" : "oklch(0.97 0 0)",
    secondaryForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.205 0 0)",
    muted: isDark ? "oklch(0.269 0 0)" : "oklch(0.97 0 0)",
    mutedForeground: isDark ? "oklch(0.708 0 0)" : "oklch(0.556 0 0)",
    accent: isDark ? "oklch(0.269 0 0)" : "oklch(0.97 0 0)",
    accentForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.205 0 0)",
    destructive: isDark
      ? "oklch(0.396 0.141 25.723)"
      : "oklch(0.577 0.245 27.325)",
    destructiveForeground: isDark
      ? "oklch(0.637 0.237 25.331)"
      : "oklch(0.577 0.245 27.325)",
    border: isDark ? "oklch(0.269 0 0)" : "oklch(0.922 0 0)",
    ring: isDark ? "oklch(0.439 0 0)" : "oklch(0.708 0 0)",
    sidebar: isDark ? "oklch(0.205 0 0)" : "oklch(0.985 0 0)",
    sidebarForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.145 0 0)",
    sidebarPrimary: isDark ? "oklch(0.488 0.243 264.376)" : "oklch(0.205 0 0)",
    sidebarPrimaryForeground: isDark ? "oklch(0.985 0 0)" : "oklch(0.985 0 0)",
  };

  const colors = {
    "--bs-background":
      appearance?.colors?.background ?? fallbackColors.background,
    "--bs-foreground":
      appearance?.colors?.foreground ?? fallbackColors.foreground,

    // Card (reusing background/foreground)
    "--bs-card": appearance?.colors?.background ?? fallbackColors.card,
    "--bs-card-foreground":
      appearance?.colors?.foreground ?? fallbackColors.cardForeground,

    // Popover (reusing background/foreground)
    "--bs-popover": appearance?.colors?.background ?? fallbackColors.background,
    "--bs-popover-foreground":
      appearance?.colors?.foreground ?? fallbackColors.foreground,

    // Primary
    "--bs-primary": appearance?.colors?.primary ?? fallbackColors.primary,
    "--bs-primary-foreground":
      appearance?.colors?.primaryForeground ?? fallbackColors.primaryForeground,

    // Secondary
    "--bs-secondary": appearance?.colors?.secondary ?? fallbackColors.secondary,
    "--bs-secondary-foreground":
      appearance?.colors?.secondaryForeground ??
      fallbackColors.secondaryForeground,

    // Muted
    "--bs-muted": appearance?.colors?.muted ?? fallbackColors.muted,
    "--bs-muted-foreground":
      appearance?.colors?.mutedForeground ?? fallbackColors.mutedForeground,

    // Accent
    "--bs-accent": appearance?.colors?.accent ?? fallbackColors.accent,
    "--bs-accent-foreground":
      appearance?.colors?.accentForeground ?? fallbackColors.accentForeground,

    // Destructive
    "--bs-destructive":
      appearance?.colors?.destructive ?? fallbackColors.destructive,
    "--bs-destructive-foreground": fallbackColors.destructiveForeground,

    // Border and Input
    "--bs-border": appearance?.colors?.border ?? fallbackColors.border,
    "--bs-input": appearance?.colors?.border ?? fallbackColors.border,
    "--bs-ring": appearance?.colors?.ring ?? fallbackColors.ring,

    // Chart colors (keeping original values)
    "--bs-chart-1": isDark
      ? "oklch(0.488 0.243 264.376)"
      : "oklch(0.646 0.222 41.116)",
    "--bs-chart-2": isDark
      ? "oklch(0.696 0.17 162.48)"
      : "oklch(0.6 0.118 184.704)",
    "--bs-chart-3": isDark
      ? "oklch(0.769 0.188 70.08)"
      : "oklch(0.398 0.07 227.392)",
    "--bs-chart-4": isDark
      ? "oklch(0.627 0.265 303.9)"
      : "oklch(0.828 0.189 84.429)",
    "--bs-chart-5": isDark
      ? "oklch(0.645 0.246 16.439)"
      : "oklch(0.769 0.188 70.08)",

    // Sidebar
    "--bs-sidebar": appearance?.colors?.background ?? fallbackColors.sidebar,
    "--bs-sidebar-foreground":
      appearance?.colors?.foreground ?? fallbackColors.sidebarForeground,
    "--bs-sidebar-primary":
      appearance?.colors?.primary ?? fallbackColors.sidebarPrimary,
    "--bs-sidebar-primary-foreground":
      appearance?.colors?.primaryForeground ??
      fallbackColors.sidebarPrimaryForeground,
    "--bs-sidebar-accent": appearance?.colors?.accent ?? fallbackColors.accent,
    "--bs-sidebar-accent-foreground":
      appearance?.colors?.accentForeground ?? fallbackColors.accentForeground,
    "--bs-sidebar-border": appearance?.colors?.border ?? fallbackColors.border,
    "--bs-sidebar-ring": appearance?.colors?.ring ?? fallbackColors.ring,
  };

  return colors;
};

export const convertCheckoutAppearanceToStripeAppearance = (
  appearance?: AppearanceConfig,
  fonts?: StripeElementsOptions["fonts"]
): StripeAppearance => {
  const currentVariables = getVariablesFromAppearanceConfig(appearance);
  const newAppearance: StripeAppearance = {
    theme: "flat",
    rules: {
      ".Input": {
        padding: "12px",
        border: `1px solid ${currentVariables["--bs-border"]}`,
        backgroundColor: currentVariables["--bs-background"],
        fontSize: "14px",
        outline: "none",
      },
      ".Input:focus": {
        backgroundColor: currentVariables["--bs-secondary"],
      },
      ".Input::placeholder": {
        fontSize: "14px",
        color: currentVariables["--bs-muted-foreground"],
      },
      ".Label": {
        marginBottom: "8px",
        fontSize: "14px",
        fontWeight: "500",
      },
      ".Input:disabled, .Input--bs-invalid:disabled": {
        cursor: "not-allowed",
      },
      // ".Block": {
      //   backgroundColor: "#000000",
      //   boxShadow: "none",
      //   padding: "12px",
      // },
      ".Tab": {
        padding: "10px 12px 8px 12px",
        border: `1px solid ${currentVariables["--bs-border"]}`,
        backgroundColor: currentVariables["--bs-background"],
      },
      ".Tab:hover": {
        backgroundColor: currentVariables["--bs-secondary"],
      },
      ".Tab--bs-selected, .Tab--bs-selected:focus, .Tab--bs-selected:hover": {
        border: `1px solid ${currentVariables["--bs-border"]}`,
        backgroundColor: currentVariables["--bs-secondary"],
        color: currentVariables["--bs-foreground"],
      },
    },
    variables: {
      focusOutline: "none",
      focusBoxShadow: "none",

      fontFamily: fonts
        ? currentVariables["--bs-font-sans"]
        : stripeAppearance.variables.fontFamily,
      borderRadius: currentVariables["--bs-radius"],
      // colorSuccess: currentVariables["--bs-success"],
      // colorWarning: currentVariables["--bs-warning"],
      colorDanger: currentVariables["--bs-destructive"],
      colorBackground: currentVariables["--bs-background"],
      colorPrimary: currentVariables["--bs-primary"],
      colorText: currentVariables["--bs-foreground"],
      colorTextSecondary: currentVariables["--bs-secondary-foreground"],
      colorTextPlaceholder: currentVariables["--bs-muted-foreground"],
    },
  };

  return newAppearance;
};
