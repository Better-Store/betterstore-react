import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
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
      format: "es",
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript(),
    postcss({
      extensions: [".css", ".module.css"],
      plugins: [tailwindcss("./tailwind.config.js"), autoprefixer()],
    }),
  ],
  external: [
    "react",
    "react-dom",
    "@betterstore/sdk",
    "@stripe/react-stripe-js",
    "@stripe/stripe-js",
    "zustand",
  ],
};
