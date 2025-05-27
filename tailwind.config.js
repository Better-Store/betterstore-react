/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  important: true, // This ensures your styles take precedence
  theme: {
    extend: {},
  },
  plugins: [],
  // corePlugins: {
  //   preflight: false,
  // },
};
