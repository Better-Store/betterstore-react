"use client";

import { useEffect } from "react";

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
    "--font-sans":
      appearance?.font ??
      '-apple-system, BlinkMacSystemFont, "Helvetica", "Gill Sans", "Inter", sans-serif',
    "--radius": appearance?.borderRadius
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
    "--background": appearance?.colors?.background ?? fallbackColors.background,
    "--foreground": appearance?.colors?.foreground ?? fallbackColors.foreground,

    // Card (reusing background/foreground)
    "--card": appearance?.colors?.background ?? fallbackColors.card,
    "--card-foreground":
      appearance?.colors?.foreground ?? fallbackColors.cardForeground,

    // Popover (reusing background/foreground)
    "--popover": appearance?.colors?.background ?? fallbackColors.background,
    "--popover-foreground":
      appearance?.colors?.foreground ?? fallbackColors.foreground,

    // Primary
    "--primary": appearance?.colors?.primary ?? fallbackColors.primary,
    "--primary-foreground":
      appearance?.colors?.primaryForeground ?? fallbackColors.primaryForeground,

    // Secondary
    "--secondary": appearance?.colors?.secondary ?? fallbackColors.secondary,
    "--secondary-foreground":
      appearance?.colors?.secondaryForeground ??
      fallbackColors.secondaryForeground,

    // Muted
    "--muted": appearance?.colors?.muted ?? fallbackColors.muted,
    "--muted-foreground":
      appearance?.colors?.mutedForeground ?? fallbackColors.mutedForeground,

    // Accent
    "--accent": appearance?.colors?.accent ?? fallbackColors.accent,
    "--accent-foreground":
      appearance?.colors?.accentForeground ?? fallbackColors.accentForeground,

    // Destructive
    "--destructive":
      appearance?.colors?.destructive ?? fallbackColors.destructive,
    "--destructive-foreground": fallbackColors.destructiveForeground,

    // Border and Input
    "--border": appearance?.colors?.border ?? fallbackColors.border,
    "--input": appearance?.colors?.border ?? fallbackColors.border,
    "--ring": appearance?.colors?.ring ?? fallbackColors.ring,

    // Chart colors (keeping original values)
    "--chart-1": isDark
      ? "oklch(0.488 0.243 264.376)"
      : "oklch(0.646 0.222 41.116)",
    "--chart-2": isDark
      ? "oklch(0.696 0.17 162.48)"
      : "oklch(0.6 0.118 184.704)",
    "--chart-3": isDark
      ? "oklch(0.769 0.188 70.08)"
      : "oklch(0.398 0.07 227.392)",
    "--chart-4": isDark
      ? "oklch(0.627 0.265 303.9)"
      : "oklch(0.828 0.189 84.429)",
    "--chart-5": isDark
      ? "oklch(0.645 0.246 16.439)"
      : "oklch(0.769 0.188 70.08)",

    // Sidebar
    "--sidebar": appearance?.colors?.background ?? fallbackColors.sidebar,
    "--sidebar-foreground":
      appearance?.colors?.foreground ?? fallbackColors.sidebarForeground,
    "--sidebar-primary":
      appearance?.colors?.primary ?? fallbackColors.sidebarPrimary,
    "--sidebar-primary-foreground":
      appearance?.colors?.primaryForeground ??
      fallbackColors.sidebarPrimaryForeground,
    "--sidebar-accent": appearance?.colors?.accent ?? fallbackColors.accent,
    "--sidebar-accent-foreground":
      appearance?.colors?.accentForeground ?? fallbackColors.accentForeground,
    "--sidebar-border": appearance?.colors?.border ?? fallbackColors.border,
    "--sidebar-ring": appearance?.colors?.ring ?? fallbackColors.ring,
  };

  return colors;
};
