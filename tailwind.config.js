/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "betterstore-",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  corePlugins: {
    preflight: false, // Disable Tailwind's base styles to prevent conflicts
  },
  important: true, // This ensures your styles take precedence
  theme: {
    extend: {},
  },
  plugins: [],
  // Prefix all CSS variables to prevent leakage
  future: {
    hoverOnlyWhenSupported: true,
  },
  // This ensures all CSS variables are prefixed
  darkMode: "class",
  // Custom prefix for CSS variables
  cssVariables: {
    prefix: "betterstore-",
  },
};
