import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default {
  input: "src/index.ts",
  output: [
    {
      file: "dist/index.cjs.js",
      format: "cjs",
    },
    {
      file: "dist/index.mjs",
      format: "esm",
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      config: {
        path: "./postcss.config.cjs",
      },
      extract: false,
      modules: false,
      minimize: false,
      inject: true,
    }),
  ],
  external: [
    "@radix-ui/react-radio-group",
    "@radix-ui/react-label",
    "@radix-ui/react-checkbox",
    "@radix-ui/react-select",
    "@radix-ui/react-roving-focus",
    "@radix-ui/react-presence",
    "@radix-ui/react-dismissable-layer",
    "@radix-ui/react-focus-guards",
    "@radix-ui/react-collection",
    "@radix-ui/react-popper",
    "@radix-ui/react-portal",
    "@radix-ui/react-focus-scope",

    "react",
    "react-dom",
    "react/jsx-runtime",
    "@stripe/react-stripe-js",
    "@stripe/stripe-js",
    "zustand",
    "zod",
    "tailwindcss-animate",
    "class-variance-authority",
    "clsx",
    "tailwind-merge",
    "lucide-react",
    "react-hook-form",
    "@hookform/resolvers",

    "i18next",
    "i18next-browser-languagedetector",
    "react-i18next",
  ],
};
