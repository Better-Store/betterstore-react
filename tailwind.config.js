/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false, // disable Tailwind's base styles
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true, // This ensures your styles take precedence
  theme: {
    extend: {},
  },
  plugins: [],
};
