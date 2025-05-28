import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { dirname, resolve as pathResolve } from "path";
import postcss from "rollup-plugin-postcss";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Custom plugin to handle "use client" directives
const removeUseClientDirective = {
  name: "remove-use-client-directive",
  transform(code) {
    return {
      code: code.replace(/^"use client";\n?/gm, ""),
      map: null,
    };
  },
};

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
    removeUseClientDirective,
    resolve({
      extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
      alias: {
        "@": pathResolve(__dirname, "src"),
      },
      browser: true,
      preferBuiltins: false,
    }),
    commonjs({
      include: /node_modules/,
    }),
    typescript(),
    json({
      include: "**/*.json",
      preferConst: true,
    }),
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
    "@radix-ui/react-dialog",
    "@radix-ui/react-dropdown-menu",
    "@radix-ui/react-popover",
    "@radix-ui/react-separator",
    "@radix-ui/react-slot",
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
    "motion",
    "@betterstore/sdk",
    "country-data-list",
    "cmdk",
    "i18next",
    "i18next-browser-languagedetector",
    "react-i18next",
    "sonner",
  ],
};
