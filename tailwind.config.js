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
};
